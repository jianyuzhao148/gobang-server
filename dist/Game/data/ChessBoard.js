"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessBoard = void 0;
var config_1 = __importDefault(require("config"));
/**
 * 棋盘类
 */
var ChessBoard = /** @class */ (function () {
    function ChessBoard() {
        this.chessBoard = new Array();
        this.chessBoardX = new Array();
        this.chessBoardY = new Array();
    }
    /**
     * 游戏开始初始化棋盘
     * @param startX 锚点X轴
     * @param startY 锚点Y轴
     * @param side 单元格边长
     */
    ChessBoard.prototype.init = function (startX, startY, side) {
        if (startX === void 0) { startX = config_1.default.get("game.startX"); }
        if (startY === void 0) { startY = config_1.default.get("game.startY"); }
        if (side === void 0) { side = config_1.default.get("game.side"); }
        var tempX = startX;
        var tempY = startY;
        for (var i = 0; i < 15; i++) {
            this.chessBoard[i] = new Array();
            for (var j = 0; j < 15; j++) {
                this.chessBoard[i][j] = null;
            }
        }
        for (var i = 0; i < 15; i++) {
            this.chessBoardX.push(tempX);
            this.chessBoardY.push(tempY);
            tempX += side;
            tempY += side;
        }
    };
    /**
     * 设置后台二维数组
     * @param locationX
     * @param locationY
     * @param value
     */
    ChessBoard.prototype.getRCInChess = function (locationX, locationY, value) {
        var row = 0;
        var column = 0;
        for (var i = 0; i < this.chessBoardX.length; i++) {
            if (locationX == this.chessBoardX[i]) {
                column = i;
                break;
            }
        }
        for (var j = 0; j < this.chessBoardY.length; j++) {
            if (locationY == this.chessBoardY[j]) {
                row = j;
                break;
            }
        }
        return { "row": row, "column": column };
    };
    return ChessBoard;
}());
exports.ChessBoard = ChessBoard;
//# sourceMappingURL=ChessBoard.js.map