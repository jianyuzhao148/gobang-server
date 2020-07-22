process.env["NODE_CONFIG_DIR"] = __dirname + "/../../config"//更改config模块读取配置路径
import { configure, getLogger, Logger } from "log4js";
import config from "config";
export class Global {

    /**
     * 获取日志操作
     */
    public static getLogger(): Logger {
        configure(Global.getConfig().get("log4js"));
        let logger: Logger = getLogger();
        return logger;
    }

    /**
     * 获取配置操作
     */
    public static getConfig(){
        return config;
    }
}