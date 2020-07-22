export interface IDataBase {
    /**
     * 插入数据
     * @param data 
     * @return 
     */
    add(sql: string, sqlPara: Array<any>): Promise<any>;

    /**
     * 通过ID删除数据
     * @param id 
     * @return 
     */
    delById(sql: string, sqlPara: Array<any>): Promise<any>;

    /**
     * 更新数据
     * @param data 
     * @param id 
     * @return 
     */
    updateById(sql: string, sqlPara: Array<any>): Promise<any>;

    /**
     * 通过ID查询数据
     * @param id 
     * @return 
     */
    queryById(sql: string, sqlPara: Array<any>): Promise<any>;

    /**
     * 查询所有数据
     * @param sql 
     */
    queryAll(sql: string): Promise<any>;

    /**
     * 释放连接
     * @param connection 
     */
    releaseConnect(connection:any): void;
}