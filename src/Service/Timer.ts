import { ITimer } from "./interface/ITimer";
import { Global } from "../Global/Global";
import { Factory } from "../Dao/Factory";
import { ICache } from "../Dao/interface/ICache";

export class Timer implements ITimer {
    private cache: ICache;

    public constructor(cacheDataBase: string) {
        this.cache = Factory.getCache();
        //订阅键过期事件通知
        this.cache.setConfig();
        this.cache.psubscribe("__keyevent@" + cacheDataBase + "__:expired");
    }

    /**
     * 为房间设置计时器
     * 如若超时会进行返回key
     * @param key 键
     */
    public setTimer(key: string): void {
        this.cache.setLimitKey(key,"",Global.getConfig().get("game.Timer"));
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