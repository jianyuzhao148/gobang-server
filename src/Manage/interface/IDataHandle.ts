export interface IDataHandle {
    
    /**
     * 添加数据
     * @param sql 
     * @param sqlParameter 
     */
    add(sql: string, sqlParameter: Array<any>): Promise<any>;

    /**
     * 删除数据
     * @param sql 
     * @param sqlParameter 
     */
    delete(sql: string, sqlParameter: Array<any>): Promise<any>;

    /**
     * 更新数据
     * @param sql 
     * @param sqlParameter 
     */
    update(sql: string, sqlParameter: Array<any>): Promise<any>;

    /**
     * 查询数据
     * @param sql 
     * @param sqlParameter 
     */
    query(sql: string, sqlParameter: Array<any>): Promise<any>;
}