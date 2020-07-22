import * as mysql from "mysql";
import { IDataBase } from "./interface/IDataBase";
import { Logger } from "log4js";
import { Global } from "../Global/Global";
import c from "config";

export class Mysql implements IDataBase {
    private pool: mysql.Pool;
    private Logger: Logger = Global.getLogger();
    private config:c.IConfig;

    public constructor() {
        this.config = Global.getConfig();
        this.pool = mysql.createPool({
            connectionLimit: this.config.get("mysql.connectionLimit"),
            host: this.config.get("mysql.host"),
            user: this.config.get("mysql.user"),
            password: this.config.get("mysql.password"),
            database: this.config.get("mysql.database")
        });
    }

    /**
     * 释放连接
     * @param connection 
     */
    public releaseConnect(connection: mysql.PoolConnection) {
        this.pool.releaseConnection(connection)
    }

    /**
     * 插入数据
     * @param sql 
     * @param sqlPara 
     */
    public add(sql: string, sqlPara: Array<any>): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.pool.getConnection((error: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (error) {
                    this.Logger.debug(error);
                    this.Logger.info("连接数据库错误--add");
                } else {
                    connection.query(sql, sqlPara, (error: any, result: any) => {
                        if (error) {
                            this.Logger.debug(error);
                            this.Logger.info("插入数据错误");
                        } else {
                            this.Logger.info("插入数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                        }
                    });
                }
                this.releaseConnect(connection);
            });
        });
        return promise;
    }

    /**
     * 通过ID删除数据
     * @param sql 
     * @param sqlPara 
     */
    public delById(sql: string, sqlPara: Array<any>): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.pool.getConnection((error: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (error) {
                    this.Logger.debug(error);
                    this.Logger.info("连接数据库错误--delById");
                } else {
                    connection.query(sql, sqlPara, (error: any) => {
                        if (error) {
                            this.Logger.debug(error);
                            this.Logger.info("删除数据错误");
                        } else {
                            this.Logger.info("删除数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                        }
                    });
                }
                this.releaseConnect(connection);
            });
        });
        return promise;
    }

    /**
     * 更新数据
     * @param sql 
     * @param sqlPara 
     */
    public updateById(sql: string, sqlPara: Array<any>): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.pool.getConnection((error: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (error) {
                    this.Logger.debug(error);
                    this.Logger.info("连接数据库错误--updataById");
                } else {
                    connection.query(sql, sqlPara, (error: any, result: any) => {
                        if (error) {
                            this.Logger.debug(error);
                            this.Logger.info("更新数据错误");
                            resolve(result);
                        } else {
                            this.Logger.info("更新数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                            resolve(result);
                        }
                    });
                }
                this.releaseConnect(connection);
            });
        });
        return promise;
    }

    /**
     * 根据ID查询数据
     * @param sql 
     * @param sqlPara
     * @return JSONstring 
     */
    public queryById(sql: string, sqlPara: Array<any>): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.pool.getConnection((error: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (error) {
                    this.Logger.debug(error);
                    this.Logger.info("连接数据库错误--queryById");
                } else {
                    connection.query(sql, sqlPara, (error: any, result: any) => {
                        if (error) {
                            this.Logger.debug(error);
                            this.Logger.info("查找数据错误");
                        } else {
                            if(result.length>0){
                                this.Logger.info("查找数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                                resolve(JSON.stringify(result[0]));
                            }else{
                                this.Logger.info("数据不存在," + "sql: " + sql + " sqlPara: " + sqlPara);
                                resolve(0);
                            }
                            
                        }
                    });
                }
                this.releaseConnect(connection);
            });
        });
        return promise;
    }

    /**
     * 查询所有数据
     * @param sql 
     */
    public queryAll(sql: string): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.pool.getConnection((error: mysql.MysqlError, connection: mysql.PoolConnection) => {
                if (error) {
                    this.Logger.debug(error);
                    this.Logger.info("连接数据库错误--queryAll");
                } else {
                    connection.query(sql, (error: any, result: any) => {
                        if (error) {
                            this.Logger.debug(error);
                            this.Logger.info("查找数据错误");
                        } else {
                            this.Logger.info("查找数据成功," + "sql: " + sql);
                            resolve(result);
                        }
                    });
                }
                this.releaseConnect(connection);
            });
        });
        return promise;
    }
}