import { Room } from "../base/Room";
import socket from "socket.io";

export interface IRoomHandle {

    /**
     * 创建房间
     * @param userId
     * @param socketid 
     */
    createRoom(userId: string, socket: socket.Socket): Promise<any>;

    /**
     * 匹配房间
     * @param user
     * @param socketid 
     */
    matchRoom(userId: string, socket: socket.Socket): Promise<any>;

    /**
     * 加入房间
     * @param roomNum 
     * @param user 
     * @param socketid 
     */
    joinRoom(roomNum: string, userId: string, socket: socket.Socket): Promise<any>;

    /**
     * 退出房间
     * @param roomNum 
     */
    outRoom(roomNum: string, userId: string, socket: socket.Socket): Promise<any>;

    /**
     * 房间列表
     */
    roomList(): Promise<any>;

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