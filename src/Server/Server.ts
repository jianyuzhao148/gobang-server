import socket from "socket.io";
import http from "http";
import { RoomHandle } from "../Service/RoomHandle";
import { GameHandle } from "../Game/GameHandle";
import { LoginHandle } from "../Game/LoginHandle";
import { IRoomHandle } from "../Service/interface/IRoomHandle";
import { ITimer } from "../Service/interface/ITimer";
import { Timer } from "../Service/Timer";
import { Room } from "../Service/base/Room";

export class Server {
    private roomHandle: IRoomHandle;
    private gameHandle: GameHandle;
    private loginHandle: LoginHandle;
    private httpServer = http.createServer();
    private timer: ITimer;
    private io: socket.Server;

    public constructor() {
        this.io = socket(this.httpServer);
        this.roomHandle = new RoomHandle();
        this.gameHandle = new GameHandle()
        this.loginHandle = new LoginHandle();
        this.timer = new Timer("0");

        this.httpServer.listen(8081);
        this.startWorker();
    }

    public async startWorker() {
        this.io.of("gobang").on("connection", async (socket: socket.Socket) => {

            socket.on("0", async (data) => {//登陆响应
                this.io.of("gobang").to(socket.id).emit("0", await this.loginHandle.login(data.userId, data.password));
            });

            socket.on("1", async (data) => {
                this.io.of("gobang").to(socket.id).emit("1", await this.roomHandle.roomList());//发送私人消息
            });

            socket.on("2", async (data) => {
                let room = await this.roomHandle.createRoom(data.userId, socket);
                if (room != 0) {
                    this.io.of("gobang").to(socket.id).emit("2", room.roomNum);//发送私人消息
                }
            });

            socket.on("3", async (data) => {
                let roomNum = await this.roomHandle.matchRoom(data.userId, socket);
                this.io.of("gobang").to(roomNum).emit("3", roomNum);//广播房间消息
            });

            socket.on("4", async (data) => {
                let roomNum = await this.roomHandle.joinRoom(data.roomNum, data.userId, socket);
                this.io.of("gobang").to(roomNum).emit("4", roomNum);//广播房间消息
            });

            // socket.on("5", async (data) => {

            // });

            this.timer.setTimer("test");
            this.timer.outTimer((message: any) => {
                this.timer.stopTimer(message);
                console.log(message);
            });

            socket.on("100",async (data)=>{
                let room=await this.gameHandle.gameStart(data.roomNum);
                if(room!=0){//游戏开始成功
                    this.io.of("gobang").to(room.player[0].socketId).emit("100", {color:false,state:false});//广播房间消息
                    this.io.of("gobang").to(room.player[1].socketId).emit("100", {color:true,state:false});//广播房间消息
                }else{
                    this.io.of("gobang").to(data).emit("100", 0);//广播房间消息
                }
            });
        });
    }
}
new Server();