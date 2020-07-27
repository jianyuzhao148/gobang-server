import { Factory } from "../Dao/Factory";
import { ICache } from "../Dao/interface/ICache";
import { IDataBase } from "../Dao/interface/IDataBase";
import { IDataHandle } from "./interface/IDataHandle";
/**
 * 数据操作
 * 直接操作DAO，实现缓存+主存配合实现增删改查
 * 弊端：操作主副的顺序,性能差但简单
 */
export class DataHandle implements IDataHandle {
    private cache: ICache;
    private database: IDataBase;

    public constructor() {
        this.cache = Factory.getCache();//获取缓存单例
        this.database = Factory.getDataBase();//获取数据库单例
    }

    /**
     * 添加数据，直接写入主存
     * return 影响行数
     * @param sql 
     * @param sqlParameter 
     */
    public add(sql: string, sqlParameter: Array<any>): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let result = await this.database.add(sql, sqlParameter);
            resolve(result);
        });
        return promise;
    }

    /**
     * 删除数据，删除缓存，删除数据
     * return 影响行数
     * @param sql 
     * @param sqlParameter 
     */
    public async delete(sql: string, sqlParameter: Array<any>): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            if (await this.cache.remById("cache", sqlParameter[0], sqlParameter[0])) {//删除缓存
                let result = await this.database.delById(sql, sqlParameter);
                resolve(result);
            }
        });
        return promise;
    }

    /**
     * 更新数据
     * @param sql 
     * @param sqlParameter 
     * @param 0/result
     */
    public update(sql: string, sqlParameter: Array<any>): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            if (await this.cache.remById("cache", sqlParameter[sqlParameter.length - 1], sqlParameter[sqlParameter.length - 1])) {//删除缓存
                let result = await this.database.updateById(sql, sqlParameter);
                resolve(result);
            } else {
                console.log("删除缓存失败");
                resolve(0);
            }
        });
        return promise;
    }

    /**
     * 查询数据
     * Tip：保持查询需要的id在sqk参数最后一位
     * @param sql 
     * @param sqlParameter 
     */
    public query(sql: string, sqlParameter: Array<any>): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let getCache=await this.cache.getById("cache", sqlParameter[sqlParameter.length - 1], sqlParameter[sqlParameter.length - 1])
            if (getCache!=0) {//存在缓存
                resolve(getCache);
            } else {//查询主存并写入缓存
                let data = await this.database.queryById(sql, sqlParameter);
                if (data) {
                    this.cache.add("cache",JSON.parse(data).id , data);//写入缓存
                    resolve(data);
                }else{
                    resolve(0);
                }
            }
        });
        return promise;
    }
}