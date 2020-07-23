import { Room } from "../base/Room";
import { User } from "../base/User";

export interface IRoomHandle {

    /**
     * 创建房间
     * @param userId 
     * @param room 
     */
    createRoom(user: User, room: Room): Promise<any>;

    /**
     * 匹配房间
     * @param userId 
     */
    matchRoom(user: User): Promise<any>;

    /**
     * 加入房间
     * @param roomNum 
     * @param userId 
     */
    joinRoom(roomNum: string, user: User): Promise<any>;

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