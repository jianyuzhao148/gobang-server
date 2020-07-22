import { ChessBoard } from "./ChessBoard";
import { Room } from "../../Service/base/Room";

export class GobangRoom extends Room{
    private chessBoard:ChessBoard;//棋盘

    public constructor(){
        super();
        this.chessBoard=new ChessBoard();
        this.chessBoard.init();
    }
}