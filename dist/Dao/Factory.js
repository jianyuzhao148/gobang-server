"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
process.env["NODE_CONFIG_DIR"] = "D:/Projects/NodeJS/node/config"; //更改config模块读取配置路径import * as http from "http";
var Mysql_1 = require("./Mysql");
var Redis_1 = require("./Redis");
var config_1 = __importDefault(require("config"));
var Factory = /** @class */ (function () {
    function Factory() {
    }
    /**
     * 制造数据库单例
     * @param dataBase 数据库名称
     */
    Factory.getDataBase = function () {
        var dataBase = config_1.default.get("config.database");
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
        var cache = config_1.default.get("config.cache");
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