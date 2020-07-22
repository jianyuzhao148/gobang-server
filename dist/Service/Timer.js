"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
process.env["NODE_CONFIG_DIR"] = "D:/Projects/NodeJS/node/config"; //更改config模块读取配置路径import * as http from "http";
var config_1 = __importDefault(require("config"));
var Factory_1 = require("./Factory");
var Timer = /** @class */ (function () {
    function Timer(dataBase) {
        this.cache = Factory_1.Factory.getCache();
        //订阅键过期事件通知
        this.cache.psubscribe("__keyevent@" + dataBase + "__:expired");
    }
    /**
     * 为房间设置计时器
     * 如若超时会进行返回key
     * @param key 键
     */
    Timer.prototype.setTimer = function (key) {
        this.cache.setLimitKey(key, "", config_1.default.get("game.Timer"));
    };
    /**
     * 超时处理
     * @param func 回调超时的Key
     * example:
     *  test.outTimer((message: any)=>{
     *      console.log(message);
     *  });
     */
    Timer.prototype.outTimer = function (func) {
        this.cache.getPSubscribe(func);
    };
    /**
     * 终止计时器
     * @param key 键
     */
    Timer.prototype.stopTimer = function (key) {
        this.cache.del(key);
    };
    return Timer;
}());
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map