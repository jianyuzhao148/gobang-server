export abstract class Room {
    public roomNum: string = "";//房间id
    public player: Array<any>;//保存{userid，socketid,color}

    public constructor() {
        this.player = new Array<any>();
    }
}