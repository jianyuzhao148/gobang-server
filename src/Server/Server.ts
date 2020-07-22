import socket from "socket.io";
import http from "http";
import { IRoomHandle } from "../Service/interface/IRoomHandle";
import { RoomHandle } from "../Service/RoomHandle";
import { GobangRoom } from "../Game/data/GobangRoom";
import { Factory } from "../Dao/Factory";
import { ICache } from "../Dao/interface/ICache";

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
        let test=await roomHandle.matchRoom("5");
        // });
        console.log();
    }
}
new Server();