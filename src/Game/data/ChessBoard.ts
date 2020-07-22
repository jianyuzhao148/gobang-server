import config from "config";
/**
 * 棋盘类
 */
export class ChessBoard {
    public chessBoard: Array<Array<boolean|null>>=new Array<Array<boolean|null>>();
    public chessBoardX:Array<number>=new Array<number>();
    public chessBoardY:Array<number>=new Array<number>();

    /**
     * 游戏开始初始化棋盘
     * @param startX 锚点X轴 
     * @param startY 锚点Y轴
     * @param side 单元格边长
     */
    public init(startX:number=config.get("game.startX"), startY:number=config.get("game.startY"), side:number=config.get("game.side")) {
        let tempX:number=startX;
        let tempY:number=startY;
        for (let i = 0; i < 15; i++) {
            this.chessBoard[i]=new Array<boolean|null>();
            for (let j = 0; j < 15; j++) {
                this.chessBoard[i][j] = null;
            }
        }

        for(let i=0;i<15;i++){
            this.chessBoardX.push(tempX);
            this.chessBoardY.push(tempY);
            tempX+=side;
            tempY+=side;
        }
    }

    /**
     * 设置后台二维数组
     * @param locationX 
     * @param locationY 
     * @param value 
     */
    public getRCInChess(locationX:number,locationY:number,value:boolean):any{
        let row=0;
        let column=0;
        for(let i=0;i<this.chessBoardX.length;i++){
            if(locationX==this.chessBoardX[i]){
                column=i;
                break;
            }
        }

        for(let j=0;j<this.chessBoardY.length;j++){
            if(locationY==this.chessBoardY[j]){
                row=j;
                break;
            }
        }
        return {"row":row,"column":column};
    }
}