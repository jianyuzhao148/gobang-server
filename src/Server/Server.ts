import socket from "socket.io";
import http from "http";
import { IRoomHandle } from "../Service/interface/IRoomHandle";
import { RoomHandle } from "../Service/RoomHandle";
import { GobangRoom } from "../Game/data/GobangRoom";

export class Server {
    private httpServer = http.createServer();
    private io = socket(this.httpServer);

    public constructor() {
        this.httpServer.listen(8081);
        this.startWorker();
    }

    public async startWorker() {
        // this.io.of("gobang").on("connection", async (socket) => {
        let roomHandle: IRoomHandle = new RoomHandle({ id: "test" }, this.io);
        let tes2t = await roomHandle.createRoom("1", new GobangRoom());
        await roomHandle.joinRoom(tes2t.roomNum, "3");//加入房间
        setTimeout(await roomHandle.outRoom(tes2t.roomNum, "3"), 30000);//30秒后退出房间
        // });
        console.log();
    }
}
new Server();