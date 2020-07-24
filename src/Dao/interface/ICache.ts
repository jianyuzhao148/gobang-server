export interface ICache {

    /**
     * 获得全部缓存
     * @param key 
     * @param min 
     * @param max 
     */
    getAll(key: string, min?: string, max?: string): Promise<any>;

    /**
     * 通过ID获得缓存
     * @param key 
     * @param min 
     * @param max 
     */
    getById(key: string, min: string, max: string): Promise<any>;

    /**
     * 通过ID删除缓存
     * @param key 
     * @param min 
     * @param max 
     */
    remById(key: string, min: string, max: string): Promise<any>;

    /**
     * 添加缓存
     * @param key 
     * @param num 
     * @param element 
     */
    add(key: string, num: string, element: string): Promise<any>;

    /**
     * 删除全部缓存
     * @param key 
     */
    del(key: string): void;

    /**
     * 订阅频道 
     * @param channel 
     */
    psubscribe(channel: string): void;

    /**
     * 设置过期键
     * @param key 
     * @param value 
     * @param time 
     */
    setLimitKey(key: string, value: string, time: number): void;

    /**
     * 监听频道推送
     * @param func 
     */
    getPSubscribe(func: Function): void;

    /**
     * 打开过期键监听
     */
    setConfig():void;
}