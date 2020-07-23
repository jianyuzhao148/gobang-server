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
exports.RoomHandle = void 0;
var Factory_1 = require("../Dao/Factory");
var Global_1 = require("../Global/Global");
/**
 * 房间处理（rooms）
 */
var RoomHandle = /** @class */ (function () {
    function RoomHandle(socket, io) {
        this.socket = socket;
        this.io = io;
        this.cache = Factory_1.Factory.getCache();
        this.logger = Global_1.Global.getLogger();
    }
    /**
     * 创建房间后返回房间
     * @param userId 用户ID
     * @param room Room实现类
     * @returns 0/room:JSON
     */
    RoomHandle.prototype.createRoom = function (userId, room) {
        var _this = this;
        var date = new Date();
        room.roomNum = date.getSeconds().toString() + date.getMilliseconds().toString()
            + Math.round(Math.random() * 99).toString(); //随机生成房间号
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room.player.push({ "userId": userId, "socketId": this.socket.id });
                        return [4 /*yield*/, this.cache.add("rooms", room.roomNum, JSON.stringify(room))];
                    case 1:
                        if ((_a.sent()) > 0) { //创建成功
                            this.logger.info("用户: " + userId + " 创建房间：" + room.roomNum + " 成功");
                            resolve(room);
                        }
                        else {
                            this.logger.info("用户: " + userId + " 创建房间失败");
                            resolve(0);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 快速开始
     * @param userId
     * @returns 0/roomNum
     */
    RoomHandle.prototype.matchRoom = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var roomList, i, room, roomNum;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.roomList()];
                            case 1:
                                roomList = _a.sent();
                                if (!(roomList != 0)) return [3 /*break*/, 7];
                                this.logger.info("用户：" + userId + "加入匹配队列");
                                i = 0;
                                _a.label = 2;
                            case 2:
                                if (!(i < roomList.length)) return [3 /*break*/, 6];
                                room = JSON.parse(roomList[i]);
                                if (!(room.player.length < 2)) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.joinRoom(room.roomNum, userId)];
                            case 3:
                                roomNum = _a.sent();
                                resolve(roomNum);
                                return [3 /*break*/, 6];
                            case 4:
                                if (i == roomList.length - 1) { //若是最后一个元素
                                    this.logger.info("用户：" + userId + "匹配失败暂无合适房间");
                                    resolve(0);
                                    return [3 /*break*/, 6];
                                }
                                _a.label = 5;
                            case 5:
                                i++;
                                return [3 /*break*/, 2];
                            case 6: return [3 /*break*/, 8];
                            case 7:
                                this.logger.info("用户：" + userId + "匹配失败暂无房间");
                                resolve(0);
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * 加入房间
     * @param roomNum
     * @returns 0/roomNum
     */
    RoomHandle.prototype.joinRoom = function (roomNum, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var roomObject, room;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.getRoom(roomNum)];
                            case 1:
                                roomObject = _a.sent();
                                if (!(roomObject != 0)) return [3 /*break*/, 3];
                                room = JSON.parse(roomObject);
                                room.player.push({ "userId": userId, "socketId": this.socket.id });
                                return [4 /*yield*/, this.reSetRoom(room)];
                            case 2:
                                if ((_a.sent()) == 1) {
                                    this.logger.info("用户：" + userId + "成功加入房间：" + roomNum);
                                    resolve(room.roomNum);
                                }
                                else {
                                    resolve(0);
                                    this.logger.info("用户：" + userId + "加入房间：" + roomNum + " 失败");
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                resolve(0);
                                this.logger.info("用户：" + userId + "加入房间：" + roomNum + " 失败");
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * 退出房间
     * @param roomNum
     */
    RoomHandle.prototype.outRoom = function (roomNum, userId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var object, room, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRoom(roomNum)];
                    case 1:
                        object = _a.sent();
                        if (!(object != 0)) return [3 /*break*/, 8];
                        room = JSON.parse(object);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < room.player.length)) return [3 /*break*/, 7];
                        if (!(room.player[i].userId == userId)) return [3 /*break*/, 6];
                        room.player.splice(i, 1);
                        this.logger.info("用户：" + userId + "已退出加入房间：" + roomNum);
                        if (!(room.player.length == 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cache.remById("rooms", roomNum, roomNum)];
                    case 3:
                        _a.sent();
                        this.logger.info("房间： " + roomNum + " 已经被解散");
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.reSetRoom(room)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7:
                        resolve(1);
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 房间列表
     * @returns 0/roomList
     */
    RoomHandle.prototype.roomList = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var roomList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.getAll("rooms")];
                    case 1:
                        roomList = _a.sent();
                        if (roomList != 0) {
                            resolve(roomList);
                        }
                        else {
                            resolve(0);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 发送房间广播
     * @param roomNum
     * @param magNum
     * @param data
     * @param nameSpace
     */
    RoomHandle.prototype.roomMessage = function (nameSpace, roomNum, magNum, data) {
        this.io.of(nameSpace).to(roomNum).emit(magNum, data);
    };
    /**
     * 发送用户消息
     * @param socketid
     * @param msgNum
     * @param data
     * @param nameSpace
     */
    RoomHandle.prototype.roomMessageTo = function (nameSpace, socketid, msgNum, data) {
        this.io.of(nameSpace).to(socketid).emit(msgNum, data);
    };
    /**
     * 获取房间
     * @param roomNum
     * @returns
     * @returns 0/room:string
     */
    RoomHandle.prototype.getRoom = function (roomNum) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.getById("rooms", roomNum, roomNum)];
                    case 1:
                        room = _a.sent();
                        if (room != 0) {
                            resolve(room);
                        }
                        else {
                            resolve(0);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    /**
     * 修改房间
     * @param room 修改后房间
     * @returns 0/1
     */
    RoomHandle.prototype.reSetRoom = function (room) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.remById("rooms", room.roomNum, room.roomNum)];
                    case 1:
                        if (!((_a.sent()) == 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cache.add("rooms", room.roomNum, JSON.stringify(room))];
                    case 2:
                        if (_a.sent()) {
                            resolve(1);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        resolve(0);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        return promise;
    };
    return RoomHandle;
}());
exports.RoomHandle = RoomHandle;
//# sourceMappingURL=RoomHandle.js.map