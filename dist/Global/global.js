"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
process.env["NODE_CONFIG_DIR"] = __dirname + "/../../config"; //更改config模块读取配置路径
var log4js_1 = require("log4js");
var config_1 = __importDefault(require("config"));
var Global = /** @class */ (function () {
    function Global() {
    }
    /**
     * 获取日志操作
     */
    Global.getLogger = function () {
        log4js_1.configure(Global.getConfig().get("log4js"));
        var logger = log4js_1.getLogger();
        return logger;
    };
    /**
     * 获取配置操作
     */
    Global.getConfig = function () {
        return config_1.default;
    };
    return Global;
}());
exports.Global = Global;
//# sourceMappingURL=Global.js.map