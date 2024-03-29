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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = __importDefault(require("http"));
var Server = /** @class */ (function () {
    function Server() {
        this.httpServer = http_1.default.createServer();
        this.io = socket_io_1.default(this.httpServer);
        this.httpServer.listen(8081);
        this.startWorker();
    }
    Server.prototype.startWorker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.io.of("gobang").on("connection", function (socket) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        console.log("a user connection");
                        // let roomHandle = new RoomHandle(socket, this.io);
                        // let gameHandle=new GameHandle(socket, this.io);
                        // socket.on("1", async () => {
                        //     Global.getLogger().info(socket.id + "进入游戏");
                        //     roomHandle.roomMessageTo("gobang", socket.id, 1, await roomHandle.roomList());
                        // });
                        // socket.on("2", async (data) => {
                        //     let room = await roomHandle.createRoom(data.userId, new GobangRoom());
                        //     if (room != 0) {
                        //         roomHandle.roomMessageTo("gobang", socket.id, 2, room.roomNum);
                        //     }
                        // });
                        // socket.on("3", async (data) => {
                        //     let roomNum = await roomHandle.matchRoom(data.userId);
                        //     roomHandle.roomMessageTo("gobang", socket.id, 3, roomNum);
                        // });
                        // socket.on("4", async (data) => {
                        //     let roomNum = await roomHandle.joinRoom(data.roomNum, data.userId);
                        //     roomHandle.roomMessageTo("gobang", socket.id, 4, roomNum);
                        // });
                        // socket.on("100",async (data)=>{
                        //     gameHandle.gameStart(data.userId);
                        // });
                        socket.on('disconnect', function (socket) {
                            _this.io.close();
                        });
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return Server;
}());
exports.Server = Server;
new Server();
//# sourceMappingURL=Server.js.map