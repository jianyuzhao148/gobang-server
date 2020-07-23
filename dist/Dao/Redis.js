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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
var redis = __importStar(require("redis"));
var Global_1 = require("../Global/Global");
/**
 * 封装Redis
 */
var Redis = /** @class */ (function () {
    function Redis() {
        this.logger = Global_1.Global.getLogger();
        this.redisClient = redis.createClient(Global_1.Global.getConfig().get("redis.port"), Global_1.Global.getConfig().get("redis.host"));
        this.reidsPSubscribe = redis.createClient(Global_1.Global.getConfig().get("redis.port"), Global_1.Global.getConfig().get("redis.host"));
    }
    /**
     * 获取（全部）缓存
     * @param key
     * @param min
     * @param max
     * @returns 0/result
     */
    Redis.prototype.getAll = function (key, min, max) {
        var _this = this;
        if (min === void 0) { min = "0"; }
        if (max === void 0) { max = "-1"; }
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.redisClient.zrange(key, min, max, function (error, result) {
                    if (error) {
                        _this.logger.debug(error);
                        _this.logger.info("获取缓存错误");
                        resolve(0);
                    }
                    else {
                        if (result instanceof Array && result.length > 0) {
                            resolve(result);
                        }
                        else {
                            resolve(0);
                            _this.logger.info(key + " 缓存数为0");
                        }
                    }
                });
                return [2 /*return*/];
            });
        }); });
        return promise;
    };
    /**
     * 获得指定分数缓存
     * @param key 键
     * @param element 元素
     * @returns 0/result
     */
    Redis.prototype.getById = function (key, min, max) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.redisClient.zrangebyscore(key, min, max, function (error, result) {
                    if (error) {
                        _this.logger.debug(error);
                        _this.logger.info("获取缓存错误");
                        resolve(0);
                    }
                    else {
                        if (result instanceof Array && result.length > 0) {
                            resolve(result);
                        }
                        else {
                            _this.logger.info(key + " 缓存数为0");
                            resolve(0);
                        }
                    }
                });
                return [2 /*return*/];
            });
        }); });
        return promise;
    };
    /**
     * 删除指定ID缓存
     * @param key 键
     * @param min 最小分数
     * @param max 最大分数
     * @returns 0/1
     */
    Redis.prototype.remById = function (key, min, max) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.redisClient.zremrangebyscore(key, min, max, function (error, result) {
                    if (error) {
                        _this.logger.debug(error);
                        _this.logger.info("删除缓存错误");
                        resolve(0);
                    }
                    else {
                        resolve(result);
                        _this.logger.info("删除缓存" + min + "~" + max + "成功");
                    }
                });
                return [2 /*return*/];
            });
        }); });
        return promise;
    };
    /**
     * 添加缓存
     * @param key 键
     * @param num 分数
     * @param data 元素
     * @returns 0/1
     */
    Redis.prototype.add = function (key, num, element) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getById(key, num, num)];
                    case 1:
                        if ((_a.sent()) == 0) { //检查id重复
                            this.redisClient.zadd(key, num, element, function (error, result) {
                                if (error) {
                                    _this.logger.debug(error);
                                    _this.logger.info("添加缓存错误");
                                    resolve(0);
                                }
                                else {
                                    resolve(result);
                                    _this.logger.info("添加缓存成功" + " value: " + element);
                                }
                            });
                        }
                        else {
                            this.logger.info("添加缓存错误,ID重复");
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 删除键
     * @param key
     */
    Redis.prototype.del = function (key) {
        this.redisClient.del(key);
        this.logger.info("删除键成功" + " Key: " + key);
    };
    /**
     * 订阅频道
     * @param channel 频道
     */
    Redis.prototype.psubscribe = function (channel) {
        this.reidsPSubscribe.psubscribe(channel);
    };
    /**
     * 设置过期键
     * @param key 键名
     * @param value 键值
     * @param time 过期时间(s)
     */
    Redis.prototype.setLimitKey = function (key, value, time) {
        this.redisClient.set(key, value, "EX", time);
    };
    /**
     * 获取频道推送
     */
    Redis.prototype.getPSubscribe = function (func) {
        this.reidsPSubscribe.on("pmessage", function (pattern, channel, message) {
            func(message);
        });
    };
    return Redis;
}());
exports.Redis = Redis;
//# sourceMappingURL=Redis.js.map