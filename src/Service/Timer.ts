import { ITimer } from "./interface/ITimer";
import { Global } from "../Global/Global";
import { Factory } from "../Dao/Factory";
import { ICache } from "../Dao/interface/ICache";
import { RoomHandle } from "./RoomHandle";
import { Room } from "./base/Room";

export class Timer implements ITimer {
    private cache: ICache;
    private socket:any;
    private io:any;

    public constructor(cacheDataBase: string,socket:any,io:any) {
        this.cache = Factory.getCache();
        //订阅键过期事件通知
        this.cache.psubscribe("__keyevent@" + cacheDataBase + "__:expired");
        this.socket=socket;
        this.io=io;
    }

    /**
     * 为房间设置计时器
     * 如若超时会进行返回key
     * @param key 键
     */
    public setTimer(key: string): void {
        this.outTimer(async (message:any)=>{
            let roomHandle=new RoomHandle(this.socket,this.io);
            let room:Room=await roomHandle.getRoom(message);
            roomHandle.roomMessage("gobang",room.roomNum,500,{winner:room.player[1].userId})
        })
        this.cache.setLimitKey(key, "", Global.getConfig().get("game.Timer"));
        
    }

    /**
     * 超时处理
     * @param func 回调超时的Key
     * example:
     *  test.outTimer((message: any)=>{
     *      console.log(message);
     *  });
     */
    public outTimer(func: Function): void {
        this.cache.getPSubscribe(func);
    }

    /**
     * 终止计时器
     * @param key 键
     */
    public stopTimer(key: string) {
        this.cache.del(key);
    }
}