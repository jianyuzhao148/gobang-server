"use strict";
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
exports.DataHandle = void 0;
var Factory_1 = require("../Dao/Factory");
/**
 * 数据操作
 * 直接操作DAO，实现缓存+主存配合实现增删改查
 * 弊端：操作主副的顺序,性能差但简单
 */
var DataHandle = /** @class */ (function () {
    function DataHandle() {
        this.cache = Factory_1.Factory.getCache(); //获取缓存单例
        this.database = Factory_1.Factory.getDataBase(); //获取数据库单例
    }
    /**
     * 添加数据，直接写入主存
     * return 影响行数
     * @param sql
     * @param sqlParameter
     */
    DataHandle.prototype.add = function (sql, sqlParameter) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.database.add(sql, sqlParameter)];
                    case 1:
                        result = _a.sent();
                        resolve(result);
                        return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 删除数据，删除缓存，删除数据
     * return 影响行数
     * @param sql
     * @param sqlParameter
     */
    DataHandle.prototype.delete = function (sql, sqlParameter) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.cache.remById("cache", sqlParameter[0], sqlParameter[0])];
                            case 1:
                                if (!_a.sent()) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.database.delById(sql, sqlParameter)];
                            case 2:
                                result = _a.sent();
                                resolve(result);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * 更新数据
     */
    DataHandle.prototype.update = function (sql, sqlParameter) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.remById("cache", sqlParameter[sqlParameter.length - 1], sqlParameter[sqlParameter.length - 1])];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.database.updateById(sql, sqlParameter)];
                    case 2:
                        result = _a.sent();
                        resolve(result);
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("删除缓存失败");
                        resolve(0);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 查询数据
     */
    DataHandle.prototype.query = function (sql, sqlParameter) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var getCache, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.getById("cache", sqlParameter[sqlParameter.length - 1], sqlParameter[sqlParameter.length - 1])];
                    case 1:
                        getCache = _a.sent();
                        if (!(getCache != 0)) return [3 /*break*/, 2];
                        resolve(getCache);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.database.queryById(sql, sqlParameter)];
                    case 3:
                        data = _a.sent();
                        if (data) {
                            this.cache.add("cache", JSON.parse(data).id, data); //写入缓存
                            resolve(data);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    return DataHandle;
}());
exports.DataHandle = DataHandle;
//# sourceMappingURL=DataHandle.js.map