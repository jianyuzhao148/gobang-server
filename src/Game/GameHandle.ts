import { IRoomHandle } from "../Service/interface/IRoomHandle";
import { ITimer } from "../Service/interface/ITimer";
import { RoomHandle } from "../Service/RoomHandle";
import { Timer } from "../Service/Timer";
import { Logger } from "log4js";
import { Global } from "../Global/Global";

export class GameHandle {
    private roomHandle: IRoomHandle;
    private timer: ITimer;
    private logger: Logger;

    public constructor() {
        this.roomHandle = new RoomHandle();
        this.timer = new Timer("0");
        this.logger = Global.getLogger();
    }

    /**
     * 开始游戏
     * @param room 
     */
    public async gameStart(roomNum: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomObject = await this.roomHandle.getRoom(roomNum);
            console.log(roomObject);
            let room = JSON.parse(roomObject);
            if (room.player.length >= 2) {
                let color = this.setOrder();
                room.player[0].colors = color;
                room.player[1].colors = !color;
                if (room.player[0].colors == true) {//更换操作位,游戏开始当前操作位为黑棋
                    await this.exchangePosition(room.player);
                    this.timer.setTimer(room.roomNum);//设置计时器
                    this.roomHandle.reSetRoom(room);//不能直接传jsong   
                    resolve(room);//返回房间
                    this.logger.info("房间：" + room.roomNum + "游戏开始");
                }
            } else {
                resolve(0);
                this.logger.info("房间：" + room.roomNum + "开始游戏失败");
            }
        });
        return promise;
    }

    // /**
    //  * 处理游戏操作请求
    //  */
    // public async playGame(roomNum: string, color: boolean, locationX: number, locationY: number) {
    //     let roomObject: any = await this.roomHandle.getRoom(roomNum);//获取房间
    //     if (roomObject != []) {
    //         let room = JSON.parse(roomObject);
    //         Object.setPrototypeOf(room.chessBoard, ChessBoard.prototype);//获取反序列化后的对象方法
    //         if (color == room.player[0].colors) {//操作位与操作相同时处理请求
    //             let gameLogic: GameLogic = new GameLogic(room.chessBoard);
    //             let opationResult = await gameLogic.fallChess(locationX, locationY, color);//落子结果
    //             if (opationResult.result != Result.NOT) {
    //                 if (opationResult.result == Result.WIN) {//胜利
    //                     this.timer.stopTimer(room.roomNum)//关闭计时器
    //                     this.roomHandle.roomMessage("gobang", roomNum, 500, opationResult);//发送胜利结果
    //                 } else {//下棋
    //                     this.timer.setTimer(room);//重置计时器
    //                     this.roomHandle.roomMessage("gobang", roomNum, 300, opationResult);//发送落子结果
    //                 }
    //                 room.player = await this.exchangePosition(room.player);//交换操作位
    //                 this.roomHandle.reSetRoom(room);//不能直接传jsong
    //             } else {//告知操作位
    //                 this.roomHandle.roomMessageTo("gobang", room.player[0].socketId, 300, { "result": Result.NOT });
    //             }
    //         }
    //     } else {
    //         console.log(roomNum + " 房间不存在");
    //     }
    // }

    /**
     * 分配先黑白棋
     */
    private setOrder(): boolean {
        if (Math.round(Math.random()) == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 更换操作位
     * @param array 
     */
    private exchangePosition(array: Array<any>) {
        let promise = new Promise((resolve, reject) => {
            let temp = array[0];
            array[0] = array[1];
            array[1] = temp;
            resolve(array);
        });
        return promise;
    }

}