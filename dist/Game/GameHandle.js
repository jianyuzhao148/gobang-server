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
exports.GameHandle = void 0;
var RoomHandle_1 = require("../Service/RoomHandle");
var Timer_1 = require("../Service/Timer");
var ChessBoard_1 = require("./data/ChessBoard");
var GameLogic_1 = require("./GameLogic");
var Result_1 = require("./data/Result");
var Global_1 = require("../Global/Global");
var GameHandle = /** @class */ (function () {
    function GameHandle(socket, io) {
        this.roomHandle = new RoomHandle_1.RoomHandle(socket, io);
        this.timer = new Timer_1.Timer("0", socket, io);
        this.logger = Global_1.Global.getLogger();
    }
    /**
     * 开始游戏
     * @param room
     */
    GameHandle.prototype.gameStart = function (roomNum) {
        return __awaiter(this, void 0, void 0, function () {
            var roomObject, room, color;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomHandle.getRoom(roomNum)];
                    case 1:
                        roomObject = _a.sent();
                        room = JSON.parse(roomObject);
                        if (!(room.player.length >= 2)) return [3 /*break*/, 4];
                        color = this.setOrder();
                        room.player[0].colors = color;
                        room.player[1].colors = !color;
                        if (!(room.player[0].colors == true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.exchangePosition(room.player)];
                    case 2:
                        _a.sent();
                        this.roomHandle.roomMessageTo("gobang", room.player[0].socketId, 100, { "color": room.player[0].colors, "state": room.player[0].colors });
                        this.roomHandle.roomMessageTo("gobang", room.player[1].socketId, 100, { "color": room.player[1].colors, "state": room.player[0].colors });
                        _a.label = 3;
                    case 3:
                        this.timer.setTimer(room.roomNum); //设置计时器
                        this.roomHandle.reSetRoom(room); //不能直接传jsong   
                        this.logger.info("房间：" + room.roomNum + "游戏开始");
                        return [3 /*break*/, 5];
                    case 4:
                        this.roomHandle.roomMessageTo("gobang", room.player[0].socketId, 10, { data: "玩家人数不足，无法开始游戏" });
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 处理游戏操作请求
     */
    GameHandle.prototype.playGame = function (roomNum, color, locationX, locationY) {
        return __awaiter(this, void 0, void 0, function () {
            var roomObject, room, gameLogic, opationResult, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.roomHandle.getRoom(roomNum)];
                    case 1:
                        roomObject = _b.sent();
                        if (!(roomObject != [])) return [3 /*break*/, 6];
                        room = JSON.parse(roomObject);
                        Object.setPrototypeOf(room.chessBoard, ChessBoard_1.ChessBoard.prototype); //获取反序列化后的对象方法
                        if (!(color == room.player[0].colors)) return [3 /*break*/, 5];
                        gameLogic = new GameLogic_1.GameLogic(room.chessBoard);
                        return [4 /*yield*/, gameLogic.fallChess(locationX, locationY, color)];
                    case 2:
                        opationResult = _b.sent();
                        if (!(opationResult.result != Result_1.Result.NOT)) return [3 /*break*/, 4];
                        if (opationResult.result == Result_1.Result.WIN) { //胜利
                            this.timer.stopTimer(room.roomNum); //关闭计时器
                            this.roomHandle.roomMessage("gobang", roomNum, 500, opationResult); //发送胜利结果
                        }
                        else { //下棋
                            this.timer.setTimer(room); //重置计时器
                            this.roomHandle.roomMessage("gobang", roomNum, 300, opationResult); //发送落子结果
                        }
                        _a = room;
                        return [4 /*yield*/, this.exchangePosition(room.player)];
                    case 3:
                        _a.player = _b.sent(); //交换操作位
                        this.roomHandle.reSetRoom(room); //不能直接传jsong
                        return [3 /*break*/, 5];
                    case 4:
                        this.roomHandle.roomMessageTo("gobang", room.player[0].socketId, 300, { "result": Result_1.Result.NOT });
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        console.log(roomNum + " 房间不存在");
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 分配先黑白棋
     */
    GameHandle.prototype.setOrder = function () {
        if (Math.round(Math.random()) == 1) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * 更换操作位
     * @param array
     */
    GameHandle.prototype.exchangePosition = function (array) {
        var promise = new Promise(function (resolve, reject) {
            var temp = array[0];
            array[0] = array[1];
            array[1] = temp;
            resolve(array);
        });
        return promise;
    };
    return GameHandle;
}());
exports.GameHandle = GameHandle;
//# sourceMappingURL=GameHandle.js.map