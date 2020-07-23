"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mysql = void 0;
var mysql = __importStar(require("mysql"));
var Global_1 = require("../Global/Global");
var Mysql = /** @class */ (function () {
    function Mysql() {
        this.Logger = Global_1.Global.getLogger();
        this.config = Global_1.Global.getConfig();
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
    Mysql.prototype.releaseConnect = function (connection) {
        this.pool.releaseConnection(connection);
    };
    /**
     * 插入数据
     * @param sql
     * @param sqlPara
     */
    Mysql.prototype.add = function (sql, sqlPara) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (error, connection) {
                if (error) {
                    _this.Logger.debug(error);
                    _this.Logger.info("连接数据库错误--add");
                }
                else {
                    connection.query(sql, sqlPara, function (error, result) {
                        if (error) {
                            _this.Logger.debug(error);
                            _this.Logger.info("插入数据错误");
                        }
                        else {
                            _this.Logger.info("插入数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                        }
                    });
                }
                _this.releaseConnect(connection);
            });
        });
        return promise;
    };
    /**
     * 通过ID删除数据
     * @param sql
     * @param sqlPara
     */
    Mysql.prototype.delById = function (sql, sqlPara) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (error, connection) {
                if (error) {
                    _this.Logger.debug(error);
                    _this.Logger.info("连接数据库错误--delById");
                }
                else {
                    connection.query(sql, sqlPara, function (error) {
                        if (error) {
                            _this.Logger.debug(error);
                            _this.Logger.info("删除数据错误");
                        }
                        else {
                            _this.Logger.info("删除数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                        }
                    });
                }
                _this.releaseConnect(connection);
            });
        });
        return promise;
    };
    /**
     * 更新数据
     * @param sql
     * @param sqlPara
     */
    Mysql.prototype.updateById = function (sql, sqlPara) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (error, connection) {
                if (error) {
                    _this.Logger.debug(error);
                    _this.Logger.info("连接数据库错误--updataById");
                }
                else {
                    connection.query(sql, sqlPara, function (error, result) {
                        if (error) {
                            _this.Logger.debug(error);
                            _this.Logger.info("更新数据错误");
                            resolve(result);
                        }
                        else {
                            _this.Logger.info("更新数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                            resolve(result);
                        }
                    });
                }
                _this.releaseConnect(connection);
            });
        });
        return promise;
    };
    /**
     * 根据ID查询数据
     * @param sql
     * @param sqlPara
     * @return JSONstring
     */
    Mysql.prototype.queryById = function (sql, sqlPara) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (error, connection) {
                if (error) {
                    _this.Logger.debug(error);
                    _this.Logger.info("连接数据库错误--queryById");
                }
                else {
                    connection.query(sql, sqlPara, function (error, result) {
                        if (error) {
                            _this.Logger.debug(error);
                            _this.Logger.info("查找数据错误");
                        }
                        else {
                            if (result.length > 0) {
                                _this.Logger.info("查找数据成功," + "sql: " + sql + " sqlPara: " + sqlPara);
                                resolve(JSON.stringify(result[0]));
                            }
                            else {
                                _this.Logger.info("数据不存在," + "sql: " + sql + " sqlPara: " + sqlPara);
                                resolve(0);
                            }
                        }
                    });
                }
                _this.releaseConnect(connection);
            });
        });
        return promise;
    };
    /**
     * 查询所有数据
     * @param sql
     */
    Mysql.prototype.queryAll = function (sql) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (error, connection) {
                if (error) {
                    _this.Logger.debug(error);
                    _this.Logger.info("连接数据库错误--queryAll");
                }
                else {
                    connection.query(sql, function (error, result) {
                        if (error) {
                            _this.Logger.debug(error);
                            _this.Logger.info("查找数据错误");
                        }
                        else {
                            _this.Logger.info("查找数据成功," + "sql: " + sql);
                            resolve(result);
                        }
                    });
                }
                _this.releaseConnect(connection);
            });
        });
        return promise;
    };
    return Mysql;
}());
exports.Mysql = Mysql;
//# sourceMappingURL=Mysql.js.map