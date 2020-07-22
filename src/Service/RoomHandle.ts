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
     * 创建房间后返回房间-yes
     * @param userId 用户ID
     * @param room Room实现类
     */
    public createRoom(userId: string, room: Room): Promise<any> {
        let date = new Date();
        room.roomNum = date.getSeconds().toString() + date.getMilliseconds().toString()
            + Math.round(Math.random() * 99).toString();//随机生成房间号

        let promise = new Promise(async (resolve, reject) => {
            room.player.push({ "userId": userId, "socketId": this.socket.id });
            if (await this.cache.add("rooms", room.roomNum, JSON.stringify(room)) > 0) {//创建成功
                this.logger.info("用户ID: " + userId + " 创建房间：" + room.roomNum + " 成功");
                resolve(room);
            } else {
                this.logger.info("用户ID: " + userId + " 创建房间：" + room.roomNum + " 失败");
            }
        });
        return promise;
    }

    /**
     * 快速开始
     * @param userId 
     */
    public async matchRoom(userId: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomList = await this.roomList();//获取房间列表
            for (let i = 0; i < roomList.length; i++) {
                let room = JSON.parse(roomList[i]);
                if (room.player.length < 2) {//房间内玩家小于2
                    let roomNum = await this.joinRoom(room.roomNum, userId);
                    resolve(roomNum);
                }
            }
        });
        return promise;
    }

    /**
     * 加入房间
     * @param roomNum 
     */
    public async joinRoom(roomNum: string, userId: string): Promise<any> {
        let roomObject = await this.getRoom(roomNum);
        let promise = new Promise(async (resolve, reject) => {
            let room: Room = JSON.parse(roomObject);
            room.player.push({ "userId": userId, "socketId": this.socket.id });
            await this.reSetRoom(room);
            this.logger.info("用户："+userId+"成功加入房间："+roomNum);
            resolve(room.roomNum);
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
            let room=JSON.parse(object);
            for (let i = 0; i < room.player.length; i++) {
                if (room.player[i].userId == userId) {
                    room.player.splice(i, 1);
                    this.logger.info("用户："+userId+"已退出加入房间："+roomNum);
                    if (room.player.length == 0) {//若离开的是最后一个玩家则解散房间
                        await this.cache.remById("rooms", roomNum, roomNum);
                        this.logger.info("房间： " + roomNum + " 已经被解散")
                    }else{
                        this.reSetRoom(room);
                    }
                }
            }
            resolve(true);
        });
        return promise;
    }

    /**
     * 房间列表
     */
    public roomList(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            resolve(this.cache.getAll("rooms"));
        });
        return promise;
    }

    /**
     * 发送房间广播
     * @param roomNum 
     * @param magNum 
     * @param data 
     */
    public roomMassage(roomNum: string, magNum: number, data: any): void {
        this.io.to(roomNum).emit(magNum, data);
    }

    /**
     * 发送用户消息
     * @param socketid 
     * @param msgNum 
     * @param data 
     */
    public roomMassageTo(socketid: any, msgNum: number, data: any): void {
        this.io.to(socketid).emit(msgNum, data);
    }

    /**
     * 获取房间---yes
     * @param roomNum 
     */
    public getRoom(roomNum: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            resolve(this.cache.getById("rooms", roomNum, roomNum));
        });
        return promise;
    }

    /**
     * 修改房间
     * @param room 修改后房间
     */
    public reSetRoom(room: Room): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.cache.remById("rooms", room.roomNum, room.roomNum);
            this.cache.add("rooms", room.roomNum, JSON.stringify(room));
            resolve(1);
        });
        return promise;
    }
}