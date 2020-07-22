import * as redis from "redis";
import { ICache } from "./interface/ICache";
import { Logger } from "log4js";
import { Global } from "../Global/Global"

/**
 * 封装Redis
 */
export class Redis implements ICache {
    private redisClient: any;
    private reidsPSubscribe: any;
    private logger: Logger;

    public constructor() {
        this.logger = Global.getLogger();
        this.redisClient = redis.createClient(Global.getConfig().get("redis.port"), Global.getConfig().get("redis.host"));
        this.reidsPSubscribe = redis.createClient(Global.getConfig().get("redis.port"), Global.getConfig().get("redis.host"));
    }

    /**
     * 获取（全部）缓存
     * @param key 
     * @param min 
     * @param max 
     * @returns 0/result
     */
    public getAll(key: string, min = "0", max = "-1"): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            this.redisClient.zrange(key, min, max, (error: any, result: any) => {
                if (error) {
                    this.logger.debug(error);
                    this.logger.info("获取缓存错误");
                    resolve(0);
                } else {
                    if (result instanceof Array && result.length > 0) {
                        resolve(result);
                    } else {
                        resolve(0);
                        this.logger.info(key+" 缓存数为0");
                    }
                }
            });
        });
        return promise;
    }

    /**
     * 获得指定分数缓存
     * @param key 键
     * @param element 元素
     * @returns 0/result
     */
    public getById(key: string, min: string, max: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            this.redisClient.zrangebyscore(key, min, max, (error: any, result: any) => {
                if (error) {
                    this.logger.debug(error);
                    this.logger.info("获取缓存错误");
                    resolve(0);
                } else {
                    if (result instanceof Array && result.length > 0) {
                        resolve(result);
                    } else {
                        this.logger.info(key+" 缓存数为0");
                        resolve(0);
                    }
                }
            });
        });
        return promise;
    }

    /**
     * 删除指定ID缓存
     * @param key 键
     * @param min 最小分数
     * @param max 最大分数
     * @returns 0/1
     */
    public remById(key: string, min: string, max: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            this.redisClient.zremrangebyscore(key, min, max, (error: any, result: any) => {
                if (error) {
                    this.logger.debug(error);
                    this.logger.info("删除缓存错误");
                    resolve(0);
                } else {
                    resolve(result);
                    this.logger.info("删除缓存"+min+"~"+max+"成功");
                }
            });
        });
        return promise;
    }

    /**
     * 添加缓存
     * @param key 键
     * @param num 分数
     * @param data 元素
     * @returns 0/1
     */
    public add(key: string, num: string, element: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            if (await this.getById(key, num, num) == 0) {//检查id重复
                this.redisClient.zadd(key, num, element, (error: any, result: any) => {
                    if (error) {
                        this.logger.debug(error);
                        this.logger.info("添加缓存错误");
                        resolve(0);
                    } else {
                        resolve(result);
                        this.logger.info("添加缓存成功" + " value: " + element);
                    }
                });
            } else {
                this.logger.info("添加缓存错误,ID重复");
            }
        });
        return promise;
    }

    /**
     * 删除键
     * @param key
     */
    public del(key: string): void {
        this.redisClient.del(key);
        this.logger.info("删除键成功" + " Key: " + key);
    }

    /**
     * 订阅频道
     * @param channel 频道 
     */
    public psubscribe(channel: string) {
        this.reidsPSubscribe.psubscribe(channel);
    }

    /**
     * 设置过期键
     * @param key 键名
     * @param value 键值
     * @param time 过期时间(s)
     */
    public setLimitKey(key: string, value: string, time: number) {
        this.redisClient.set(key, value, "EX", time)
    }

    /**
     * 获取频道推送
     */
    public getPSubscribe(func: Function) {
        this.reidsPSubscribe.on("pmessage", (pattern: any, channel: any, message: any) => {
            func(message);
        });
    }



    // /**
    //  * 获取指定范围list 元素集合
    //  * @param key 键
    //  * @param start 开始位
    //  * @param end 结束位置
    //  * @param func 回调
    //  */
    // public LRange(key: string, start: number, end: number, func: Function): void {
    //     this.redisClient.lrange(key, start, end, func);
    // }

    // /**
    //  * 移除右边首个元素并返回
    //  * @param key 键
    //  * @param func 回调
    //  */
    // public RPop(key: string, func: Function): void {
    //     this.redisClient.rpop(key, func);
    // }

    // /**
    //  * 左边添加元素
    //  * @param key 键
    //  * @param element 元素
    //  * @param func 回调
    //  */
    // public LPush(key: string, element: any, func: Function): void {
    //     this.redisClient.lpush(key, element, func);
    // }
}
