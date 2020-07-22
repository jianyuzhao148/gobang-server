import { Direction } from "./data/Direction";
import { ChessBoard } from "./data/ChessBoard";
import { Result } from "./data/Result";

/**
 * 游戏逻辑
 */
export class GameLogic {
    public chessBoard: ChessBoard;

    public constructor(chessBoard: ChessBoard) {
        this.chessBoard = chessBoard;
    }
    /**
     * 落子判断
     * @param locationX 
     * @param locationY 
     */
    public fallChess(locationX: number, locationY: number, color: boolean): any {
        let x = this.limitLocation(locationX, this.chessBoard.chessBoardX);//修正X坐标
        let y = this.limitLocation(locationY, this.chessBoard.chessBoardY);//修正Y坐标

        let location = this.chessBoard.getRCInChess(x, y, color);//换算成行列

        let promise = new Promise((resolve, reject) => {
            if (this.chessBoard.chessBoard[location.row][location.column] == null) {//该位置无棋子
                this.chessBoard.chessBoard[location.row][location.column] = color;
                if (this.isWin(location.row, location.column)) {
                    resolve({ 'locationX': x, 'locationY': y, "result": Result.WIN, "winner": color });//500
                } else {
                    resolve({ 'locationX': x, 'locationY': y, "result": Result.FALL, "state": !color });//300
                }
            } else {
                resolve({ "result": Result.NOT });//告知操作位300
            }
        });
        return promise;
    }

    /**
     * 修正坐标
     * @param side 单元格边长
     * @param location 玩家落子位置
     * @param array 一维数组
     */
    private limitLocation(location: number, array: Array<number>, side: number = 43): number {
        let temp = 0;

        for (let i = 0; i < array.length; i++) {
            if (array[i] >= location) {
                temp = array[i];
                break;
            }
        }

        if (temp - location >= side / 2) {
            location = temp - side;
        } else {
            location = temp;
        }
        return location;

    }

    /**
     * 基于二维数组，取得经一点的4个方向的9位取值
     * @param arr 二维数组
     * @param flag 方向
     * @param row 行
     * @param column 列 
     */
    private getContinuity(flag: Direction, row: number, column: number): Array<boolean|null> {

        let tempArr: Array<boolean|null> = new Array<boolean|null>();
        let arr = this.chessBoard.chessBoard;

        if (flag == Direction.OBLIQUE) {//正斜取9位

            for (let i = 4; i > 0; i--) {
                if (row - i >= 0 && column + i < arr[0].length) {
                    tempArr.push(arr[row - i][column + i]);

                } else {
                    continue;
                }
            }

            for (let j = 0; j <= 4; j++) {
                if (row + j < arr.length && column - j >= 0) {
                    tempArr.push(arr[row + j][column - j]);
                } else {
                    continue;
                }
            }
        }

        if (flag == Direction.ANTICLINE) {//反斜取9位
            for (let i = 4; i > 0; i--) {
                if (row - i >= 0 && column - i >= 0) {
                    tempArr.push(arr[row - i][column - i]);
                }
            }

            for (let j = 0; j <= 4; j++) {
                if (row + j < arr.length && column + j < arr[0].length) {
                    tempArr.push(arr[row + j][column + j]);
                }
            }

        }

        if (flag == Direction.VERTICAL) {//纵向取9位
            for (let i = row - 4; i <= row + 4; i++) {
                if (i >= 0 && i < arr.length) {
                    tempArr.push(arr[i][column]);
                }
            }
        }

        if (flag == Direction.TRANSVERSE) {//横向取9位
            for (let i = column - 4; i <= column + 4; i++) {
                if (i >= 0 && i < arr[0].length) {
                    tempArr.push(arr[row][i]);
                }
            }
        }
        return tempArr;
    }


    /**
     * 判断连续
     * @param arr2 各4个方向的9位取值
     */
    private isContinuity(arr: Array<boolean|null>): boolean {
        let sum = 0;
        for (let i = 0; i < arr.length - 4; i++) {//后4位不用参与判断
            for (let j = i; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    sum += 1;
                    if (sum == 5) {
                        return true;
                    }
                } else {
                    sum = 0;
                    break;
                }
            }
        }
        return false;
    }

    private isWin(row: number, column: number): boolean {
        if (this.isContinuity((this.getContinuity(Direction.OBLIQUE, row, column))) ||
            this.isContinuity((this.getContinuity(Direction.ANTICLINE, row, column))) ||
            this.isContinuity((this.getContinuity(Direction.TRANSVERSE, row, column))) ||
            this.isContinuity((this.getContinuity(Direction.VERTICAL, row, column)))) {
            return true;
        }
        return false;
    }
}
