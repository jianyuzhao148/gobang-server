import socket from "socket.io";
import http from "http";
import { Global } from "../Global/Global";
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
        this.io.of("gobang").on("connection", async (socket) => {
            let roomHandle=new RoomHandle(socket,this.io);
            socket.on("1",async ()=>{
                Global.getLogger().info(socket.id+"进入游戏");
                roomHandle.roomMessageTo("gobang",socket.id,1,await roomHandle.roomList());
            });

            socket.on("2",async (data)=>{
                let room=await roomHandle.createRoom(data.userId,new GobangRoom());
                if(room!=0){
                    roomHandle.roomMessageTo("gobang",socket.id,2,room.roomNum);
                }
            });
        });
    }
}
new Server();