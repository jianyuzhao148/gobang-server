import { Room } from "../base/Room";

export interface IRoomHandle {

    /**
     * 创建房间
     * @param userId 
     * @param room 
     */
    createRoom(userId: string, room: Room): Promise<any>;

    /**
     * 匹配房间
     * @param userId 
     */
    matchRoom(userId: string): Promise<any>;

    /**
     * 加入房间
     * @param roomNum 
     * @param userId 
     */
    joinRoom(roomNum: string, userId: string): Promise<any>;

    /**
     * 退出房间
     * @param roomNum 
     */
    outRoom(roomNum: string, userId: string):Promise<any>;

    /**
     * 房间列表
     */
    roomList(): Promise<any>;

    /**
     * 发送房间消息
     * @param roomNum 
     * @param magNum 
     * @param data 
     */
    roomMessage(nameSpace:string,roomNum: string, magNum: number, data: any): void;

    /**
     * 发送房间私人消息
     * @param socketid
     * @param msgNum 
     * @param data 
     */
    roomMessageTo(nameSpace:string,socketid: any, msgNum: number, data: any): void;

    /**
     * 获得房间信息
     * @param roomNum 
     */
    getRoom(roomNum: string): Promise<any>;

    /**
     * 重新设置房间
     * @param room 
     */
    reSetRoom(room: Room): Promise<any>;
}