import socket from "socket.io";
import http from "http";
import { Global } from "../Global/Global";
import { RoomHandle } from "../Service/RoomHandle";
import { GobangRoom } from "../Game/data/GobangRoom";
import { GameHandle } from "../Game/GameHandle";
import { User } from "../Service/base/User";
import { GobangUser } from "../Game/data/GobangUser";

export class Server {
    private httpServer = http.createServer();
    private io = socket(this.httpServer);

    public constructor() {
        this.httpServer.listen(8081);
        this.startWorker();
    }

    public async startWorker() {
        this.io.of("gobang").on("connection", async (socket: socket.Socket) => {
            let roomHandle = new RoomHandle();
            let gameHandle = new GameHandle()

            socket.on("0",(data)=>{
                this.io.of("gobang").to(socket.id).emit("0",)
            });

            socket.on("1", async (data: User) => {
                Global.getLogger().info(socket.id + "进入游戏");
                this.io.of("gobang").to(data.socketid).emit("1", await roomHandle.roomList());//发送私人消息
            });

            socket.on("2", async (data) => {
                let room = await roomHandle.createRoom(data.userId, new GobangRoom());
                if (room != 0) {
                    this.io.of("gobang").to(data.socketid).emit("2", room.roomNum);//发送私人消息
                }
            });

            socket.on("3", async (data) => {
                let roomNum = await roomHandle.matchRoom(data.userId);
                this.io.of("gobang").to(roomNum).emit("3", roomNum);//广播房间消息
            });

            socket.on("4", async (data) => {
                let roomNum = await roomHandle.joinRoom(data.roomNum, data.userId);
                this.io.of("gobang").to(roomNum).emit("4", roomNum);//广播房间消息
            });

            socket.on("5", async (data) => {

            });
        });
    }
}
new Server();