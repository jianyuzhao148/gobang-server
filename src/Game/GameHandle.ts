import { IRoomHandle } from "../Service/interface/IRoomHandle";
import { ITimer } from "../Service/interface/ITimer";
import { RoomHandle } from "../Service/RoomHandle";
import { Timer } from "../Service/Timer";
import { Logger } from "log4js";
import { Global } from "../Global/Global";
import { ChessBoard } from "./data/ChessBoard";
import { GameLogic } from "./GameLogic";
import { Result } from "./data/Result";
import { DataHandle } from "../Manage/DataHandle";
import { IDataHandle } from "../Manage/interface/IDataHandle";

export class GameHandle {
    private roomHandle: IRoomHandle;
    private timer: ITimer;
    private logger: Logger;
    private dataHandle: IDataHandle;

    public constructor() {
        this.roomHandle = new RoomHandle();
        this.timer = new Timer("0");
        this.logger = Global.getLogger();
        this.dataHandle = new DataHandle();
    }

    /**
     * 开始游戏
     * @param room 
     */
    public async gameStart(roomNum: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomObject = await this.roomHandle.getRoom(roomNum);
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

    /**
     * 处理游戏中请求
     * @param roomNum 
     * @param color 
     * @param locationX 
     * @param locationY 
     */
    public async playGame(roomNum: string, color: boolean, locationX: number, locationY: number): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let roomObject: any = await this.roomHandle.getRoom(roomNum);//获取房间
            if (roomObject != []) {
                let room = JSON.parse(roomObject);
                Object.setPrototypeOf(room.chessBoard, ChessBoard.prototype);//获取反序列化后的对象方法
                if (color == room.player[0].colors) {//操作位与操作相同时处理请求
                    let gameLogic: GameLogic = new GameLogic(room.chessBoard);
                    let opationResult = await gameLogic.fallChess(locationX, locationY, color);//落子结果
                    if (opationResult.result != Result.NOT) {//获取处理结果之后走一遍处理逻辑
                        if (opationResult.result == Result.WIN) {//胜利
                            this.timer.stopTimer(room.roomNum)//关闭计时器]
                            this.gameOver(room.player);
                        } else {//下棋
                            this.timer.setTimer(room.roomNum);//重置计时器
                            room.player = await this.exchangePosition(room.player);//交换操作位
                            this.roomHandle.reSetRoom(room);//不能直接传jsong
                        }
                    }
                    resolve(opationResult);
                }
            }
        });
        return promise;
    }

    /**
     * 游戏结束,简单实现，未使用事务，风险较大
     * 胜利方：总局数+1，胜利局数+1，胜率计算，财富计算，称号计算
     * 失败方：总局数+1，胜率计算，财富计算，称号计算
     * @param color
     * @param roomNum 
     */
    public async gameOver(player: Array<any>): Promise<any> {//[0]是胜利位{colors，userId,socketId}
        let promise = new Promise(async (resolve, reject) => {
            /*
                更新胜利玩家
             */
            let winnerResultString = await this.dataHandle.query("select total,win,wealth from gobang.user where id=?",
                [player[0].userId]);
            this.logger.debug(winnerResultString);
            let winnerResul = JSON.parse(JSON.stringify(winnerResultString));
            let total = winnerResul.total + 1;
            let win = winnerResul.win + 1;
            let wealth = winnerResul.wealth + 10;
            await this.dataHandle.update("update set title=?,total=?,win=?,probability=?,wealth=? where id=?",
                [1, total, win, (100 / total) * win, wealth, player[0].userId]);

            /*
                更新失败玩家
            */
            let loserResultString = await this.dataHandle.query("select total,win,wealth from gobang.user where id=?",
                [player[1].userId]);
            this.logger.debug(loserResultString);
            let loserResult = JSON.parse(JSON.stringify(loserResultString));
            let total2 = loserResult.total + 1;
            let wealth2 = loserResult.wealth - 10;
            await this.dataHandle.update("update set title=?,total=?,probability=?,wealth=? where id=?",
                [1, total2, (100 / total2) * winnerResul.win, wealth2, player[1].userId]);
        });
        return promise;
    }

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
    public exchangePosition(array: Array<any>) {
        let promise = new Promise((resolve, reject) => {
            let temp = array[0];
            array[0] = array[1];
            array[1] = temp;
            resolve(array);
        });
        return promise;
    }

}