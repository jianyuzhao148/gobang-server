// import { RoomHandle } from "./RoomHandle";
// import { Timer } from "../util/Timer";
// import { GameLogic } from "../logic/GameLogic";
// import { ChessBoard } from "../data/ChessBoard";
// import { Result } from "../data/Result";

// export class GameHandle {
//     private roomHandle: RoomHandle;
//     private timer:Timer;

//     public constructor(socket: any, io: any) {
//         this.roomHandle = new RoomHandle(socket, io);
//         this.timer=new Timer();
//         this.timer.outTimer(socket, io);
//     }

//     /**
//      * 开始游戏
//      */
//     public async gameStart(userId: string) {
//         let promise = new Promise(async (resolve, reject) => {
//             let roomNum: any = await this.roomHandle.pairRoom(userId);
//             if (typeof (roomNum) == "string") {//匹配到房间
//                 let roomObject: any = await this.roomHandle.getRoom(roomNum);
//                 let room = JSON.parse(roomObject);
//                 let color = this.setOrder();
//                 room.player[0].colors = color;
//                 room.player[1].colors = !color;
//                 if (room.player[0].colors == true) {//更换操作位
//                     await this.exchangePosition(room.player);
//                 }
//                 this.roomHandle.sendMessageTo(room.player[0].socketId, 100, { "color": room.player[0].colors, "roomNum": roomNum, "state": room.player[0].colors });//响应当前操作位
//                 this.roomHandle.sendMessageTo(room.player[1].socketId, 100, { "color": room.player[1].colors, "roomNum": roomNum, "state": room.player[0].colors });
//                 this.timer.setTimer(room);//设置计时器
//                 this.roomHandle.reSetRoom(JSON.stringify(room));//不能直接传jsong
//             }
//             resolve(roomNum);
//         });
//         return promise;
//     }

//     /**
//      * 处理游戏操作请求
//      */
//     public async playGame(roomNum, color: boolean, locationX, locationY) {
//         let roomObject: any = await this.roomHandle.getRoom(roomNum);//获取房间
//         if (roomObject != []) {
//             let room = JSON.parse(roomObject);
//             Object.setPrototypeOf(room.chessBoard, ChessBoard.prototype);//获取反序列化后的对象方法
//             if (color == room.player[0].colors) {//操作位与操作相同时处理请求
//                 let gameLogic: GameLogic = new GameLogic(room.chessBoard);
//                 let opationResult = await gameLogic.fallChess(locationX, locationY, color);//落子结果
//                 if (opationResult.result != Result.NOT) {
//                     if (opationResult.result == Result.WIN) {//胜利
//                         this.timer.stopTimer(room.roomNum)//关闭计时器
//                         this.roomHandle.sendRoomMassage(roomNum, 500, opationResult);//发送胜利结果
//                     } else {//下棋
//                         this.timer.setTimer(room);//重置计时器
//                         this.roomHandle.sendRoomMassage(roomNum, 300, opationResult);//发送落子结果
//                     }
//                     room.player = await this.exchangePosition(room.player);//交换操作位
//                     this.roomHandle.reSetRoom(JSON.stringify(room));//不能直接传jsong
//                 } else {//告知操作位
//                     this.roomHandle.sendMessageTo(room.player[0].socketId, 300, { "result": Result.NOT });
//                 }
//             }
//         } else {
//             console.log(roomNum + " 房间不存在");
//         }
//     }

//     /**
//      * 分配先黑白棋
//      */
//     public setOrder(): boolean {
//         if (Math.round(Math.random()) == 1) {
//             return true;
//         } else {
//             return false;
//         }
//     }

//     /**
//      * 更换操作位
//      * @param array 
//      */
//     private exchangePosition(array: Array<any>) {
//         let promise = new Promise((resolve, reject) => {
//             let temp = array[0];
//             array[0] = array[1];
//             array[1] = temp;
//             resolve(array);
//         });
//         return promise;
//     }

// }