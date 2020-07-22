import { ICache } from "../Dao/interface/ICache";
import { Factory } from "../Dao/Factory";
import { IRoomHandle } from "./interface/IRoomHandle";
import { Room } from "./base/Room";
import { Logger } from "log4js";
import { Global } from "../Global/Global";

/**
 * 房间处理（rooms）
 */
export class RoomHandle implements IRoomHandle {

    private socket: any;
    private io: any;
    private cache: ICache;
    private logger: Logger;

    public constructor(socket: any, io: any) {
        this.socket = socket;
        this.io = io;
        this.cache = Factory.getCache();
        this.logger = Global.getLogger();
    }

    /**
     * 创建房间后返回房间
     * @param userId 用户ID
     * @param room Room实现类
     * @returns 0/room:JSON
     */
    public createRoom(userId: string, room: Room): Promise<any> {
        let date = new Date();
        room.roomNum = date.getSeconds().toString() + date.getMilliseconds().toString()
            + Math.round(Math.random() * 99).toString();//随机生成房间号

        let promise = new Promise(async (resolve, reject) => {
            room.player.push({ "userId": userId, "socketId": this.socket.id });
            if (await this.cache.add("rooms", room.roomNum, JSON.stringify(room)) > 0) {//创建成功
                this.logger.info("用户: " + userId + " 创建房间：" + room.roomNum + " 成功");
                resolve(room);
            } else {
                this.logger.info("用户: " + userId + " 创建房间失败");
                resolve(0);
            }
        });
        return promise;
    }

    /**
     * 快速开始
     * @param userId 
     * @returns 0/roomNum
     */
    public async matchRoom(userId: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomList = await this.roomList();//获取房间列表
            if (roomList != 0) {
                this.logger.info("用户：" + userId + "加入匹配队列");
                for (let i = 0; i < roomList.length; i++) {
                    let room = JSON.parse(roomList[i]);
                    if (room.player.length < 2) {//房间内玩家小于2
                        let roomNum = await this.joinRoom(room.roomNum, userId);
                        resolve(roomNum);
                    }
                }
            } else {
                this.logger.info("用户：" + userId + "匹配失败暂无房间");
                resolve(0);
            }

        });
        return promise;
    }

    /**
     * 加入房间
     * @param roomNum 
     * @returns 0/roomNum
     */
    public async joinRoom(roomNum: string, userId: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomObject = await this.getRoom(roomNum);
            if (roomObject != 0) {
                let room: Room = JSON.parse(roomObject);
                room.player.push({ "userId": userId, "socketId": this.socket.id });
                if (await this.reSetRoom(room) == 1) {
                    this.logger.info("用户：" + userId + "成功加入房间：" + roomNum);
                    resolve(room.roomNum);
                } else {
                    resolve(0);
                    this.logger.info("用户：" + userId + "加入房间：" + roomNum + " 失败");
                }
            } else {
                resolve(0);
                this.logger.info("用户：" + userId + "加入房间：" + roomNum + " 失败");
            }
        });
        return promise;
    }

    /**
     * 退出房间
     * @param roomNum
     */
    public outRoom(roomNum: string, userId: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let object = await this.getRoom(roomNum);
            if (object != 0) {
                let room = JSON.parse(object);
                for (let i = 0; i < room.player.length; i++) {
                    if (room.player[i].userId == userId) {
                        room.player.splice(i, 1);
                        this.logger.info("用户：" + userId + "已退出加入房间：" + roomNum);
                        if (room.player.length == 0) {//若离开的是最后一个玩家则解散房间
                            await this.cache.remById("rooms", roomNum, roomNum);
                            this.logger.info("房间： " + roomNum + " 已经被解散")
                        } else {
                            await this.reSetRoom(room);
                        }
                    }
                }
                resolve(1);
            }

        });
        return promise;
    }

    /**
     * 房间列表
     * @returns 0/roomList
     */
    public roomList(): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomList = await this.cache.getAll("rooms")
            if (roomList != 0) {
                resolve(roomList);
            } else {
                resolve(0);
            }
        });
        return promise;
    }

    /**
     * 发送房间广播
     * @param roomNum 
     * @param magNum 
     * @param data 
     * @param nameSpace
     */
    public roomMessage(nameSpace:string,roomNum: string, magNum: number, data: any): void {
        this.io.of(nameSpace).to(roomNum).emit(magNum, data);
    }

    /**
     * 发送用户消息
     * @param socketid 
     * @param msgNum 
     * @param data 
     * @param nameSpace
     */
    public roomMessageTo(nameSpace:string,socketid: any, msgNum: number, data: any): void {
        this.io.of(nameSpace).to(socketid).emit(msgNum, data);
    }

    /**
     * 获取房间
     * @param roomNum 
     * @returns 
     * @returns 0/room
     */
    public getRoom(roomNum: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let room = await this.cache.getById("rooms", roomNum, roomNum)
            if (room != 0) {
                resolve(room);
            } else {
                resolve(0);
            }

        });
        return promise;
    }

    /**
     * 修改房间
     * @param room 修改后房间
     * @returns 0/1
     */
    public reSetRoom(room: any): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            if (await this.cache.remById("rooms", room.roomNum, room.roomNum) == 1) {
                if (await this.cache.add("rooms", room.roomNum, JSON.stringify(room))) {
                    resolve(1);
                }
            } else {
                resolve(0);
            }
        });
        return promise;
    }
}