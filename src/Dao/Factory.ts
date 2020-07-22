import { Mysql } from "./Mysql";
import { IDataBase } from "./interface/IDataBase";
import { ICache } from "./interface/ICache";
import { Redis } from "./Redis";
import { Global } from "../Global/Global";

export class Factory {
    private static _mysql: IDataBase;
    private static _Redis: ICache;

    /**
     * 制造数据库单例
     * @param dataBase 数据库名称
     */
    public static getDataBase(): IDataBase {
        let dataBase:string=Global.getConfig().get("config.database");
        if (dataBase.toLowerCase() == "mysql") {
            if (this._mysql == null) {
                this._mysql = new Mysql();
            }
        }
        return this._mysql;
    }

    /**
     * 制造缓存单例
     * @param cache 缓存数据库名称
     */
    public static getCache() {
        let cache:string=Global.getConfig().get("config.cache");
        if (cache.toLowerCase() == "redis") {
            if (this._Redis == null) {
                this._Redis = new Redis();
            }
        }
        return this._Redis;
    }

}