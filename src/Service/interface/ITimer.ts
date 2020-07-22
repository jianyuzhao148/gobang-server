export interface ITimer {

    /**
     * 设置计时器
     * @param key 
     */
    setTimer(key: string): void;

    /**
     * 超时处理
     * @param func 
     */
    outTimer(func: Function): void;

    /**
     * 停止计时器
     * @param key 
     */
    stopTimer(key: string): void;
}