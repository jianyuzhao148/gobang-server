"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GobangRoom = void 0;
var ChessBoard_1 = require("./ChessBoard");
var Room_1 = require("../../Service/base/Room");
var GobangRoom = /** @class */ (function (_super) {
    __extends(GobangRoom, _super);
    function GobangRoom() {
        var _this = _super.call(this) || this;
        _this.chessBoard = new ChessBoard_1.ChessBoard();
        _this.chessBoard.init();
        return _this;
    }
    return GobangRoom;
}(Room_1.Room));
exports.GobangRoom = GobangRoom;
//# sourceMappingURL=GobangRoom.js.map