"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogic = void 0;
var Direction_1 = require("./data/Direction");
var Result_1 = require("./data/Result");
/**
 * 游戏逻辑
 */
var GameLogic = /** @class */ (function () {
    function GameLogic(chessBoard) {
        this.chessBoard = chessBoard;
    }
    /**
     * 落子判断
     * @param locationX
     * @param locationY
     */
    GameLogic.prototype.fallChess = function (locationX, locationY, color) {
        var _this = this;
        var x = this.limitLocation(locationX, this.chessBoard.chessBoardX); //修正X坐标
        var y = this.limitLocation(locationY, this.chessBoard.chessBoardY); //修正Y坐标
        var location = this.chessBoard.getRCInChess(x, y, color); //换算成行列
        var promise = new Promise(function (resolve, reject) {
            if (_this.chessBoard.chessBoard[location.row][location.column] == null) { //该位置无棋子
                _this.chessBoard.chessBoard[location.row][location.column] = color;
                if (_this.isWin(location.row, location.column)) {
                    resolve({ 'locationX': x, 'locationY': y, "result": Result_1.Result.WIN, "winner": color }); //500
                }
                else {
                    resolve({ 'locationX': x, 'locationY': y, "result": Result_1.Result.FALL, "state": !color }); //300
                }
            }
            else {
                resolve({ "result": Result_1.Result.NOT }); //告知操作位300
            }
        });
        return promise;
    };
    /**
     * 修正坐标
     * @param side 单元格边长
     * @param location 玩家落子位置
     * @param array 一维数组
     */
    GameLogic.prototype.limitLocation = function (location, array, side) {
        if (side === void 0) { side = 43; }
        var temp = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] >= location) {
                temp = array[i];
                break;
            }
        }
        if (temp - location >= side / 2) {
            location = temp - side;
        }
        else {
            location = temp;
        }
        return location;
    };
    /**
     * 基于二维数组，取得经一点的4个方向的9位取值
     * @param arr 二维数组
     * @param flag 方向
     * @param row 行
     * @param column 列
     */
    GameLogic.prototype.getContinuity = function (flag, row, column) {
        var tempArr = new Array();
        var arr = this.chessBoard.chessBoard;
        if (flag == Direction_1.Direction.OBLIQUE) { //正斜取9位
            for (var i = 4; i > 0; i--) {
                if (row - i >= 0 && column + i < arr[0].length) {
                    tempArr.push(arr[row - i][column + i]);
                }
                else {
                    continue;
                }
            }
            for (var j = 0; j <= 4; j++) {
                if (row + j < arr.length && column - j >= 0) {
                    tempArr.push(arr[row + j][column - j]);
                }
                else {
                    continue;
                }
            }
        }
        if (flag == Direction_1.Direction.ANTICLINE) { //反斜取9位
            for (var i = 4; i > 0; i--) {
                if (row - i >= 0 && column - i >= 0) {
                    tempArr.push(arr[row - i][column - i]);
                }
            }
            for (var j = 0; j <= 4; j++) {
                if (row + j < arr.length && column + j < arr[0].length) {
                    tempArr.push(arr[row + j][column + j]);
                }
            }
        }
        if (flag == Direction_1.Direction.VERTICAL) { //纵向取9位
            for (var i = row - 4; i <= row + 4; i++) {
                if (i >= 0 && i < arr.length) {
                    tempArr.push(arr[i][column]);
                }
            }
        }
        if (flag == Direction_1.Direction.TRANSVERSE) { //横向取9位
            for (var i = column - 4; i <= column + 4; i++) {
                if (i >= 0 && i < arr[0].length) {
                    tempArr.push(arr[row][i]);
                }
            }
        }
        return tempArr;
    };
    /**
     * 判断连续
     * @param arr2 各4个方向的9位取值
     */
    GameLogic.prototype.isContinuity = function (arr) {
        var sum = 0;
        for (var i = 0; i < arr.length - 4; i++) { //后4位不用参与判断
            for (var j = i; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    sum += 1;
                    if (sum == 5) {
                        return true;
                    }
                }
                else {
                    sum = 0;
                    break;
                }
            }
        }
        return false;
    };
    GameLogic.prototype.isWin = function (row, column) {
        if (this.isContinuity((this.getContinuity(Direction_1.Direction.OBLIQUE, row, column))) ||
            this.isContinuity((this.getContinuity(Direction_1.Direction.ANTICLINE, row, column))) ||
            this.isContinuity((this.getContinuity(Direction_1.Direction.TRANSVERSE, row, column))) ||
            this.isContinuity((this.getContinuity(Direction_1.Direction.VERTICAL, row, column)))) {
            return true;
        }
        return false;
    };
    return GameLogic;
}());
exports.GameLogic = GameLogic;
//# sourceMappingURL=GameLogic.js.map