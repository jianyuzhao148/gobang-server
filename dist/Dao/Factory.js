"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
var Mysql_1 = require("./Mysql");
var Redis_1 = require("./Redis");
var Global_1 = require("../Global/Global");
var Factory = /** @class */ (function () {
    function Factory() {
    }
    /**
     * 制造数据库单例
     * @param dataBase 数据库名称
     */
    Factory.getDataBase = function () {
        var dataBase = Global_1.Global.getConfig().get("config.database");
        if (dataBase.toLowerCase() == "mysql") {
            if (this._mysql == null) {
                this._mysql = new Mysql_1.Mysql();
            }
        }
        return this._mysql;
    };
    /**
     * 制造缓存单例
     * @param cache 缓存数据库名称
     */
    Factory.getCache = function () {
        var cache = Global_1.Global.getConfig().get("config.cache");
        if (cache.toLowerCase() == "redis") {
            if (this._Redis == null) {
                this._Redis = new Redis_1.Redis();
            }
        }
        return this._Redis;
    };
    return Factory;
}());
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map