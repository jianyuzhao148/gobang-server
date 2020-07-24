import { DataHandle } from "../Manage/DataHandle"
import { IDataHandle } from "../Manage/interface/IDataHandle";
import { Global } from "../Global/Global";

export class LoginHandle {
    private dataHandle: IDataHandle;

    public constructor() {
        this.dataHandle = new DataHandle();
    }

    /**
     * 登录
     * @param userId 
     * @param password 
     * @returns User/0
     */
    public async login(userId: string, password: string): Promise<any> {
        let promise = new Promise(async (resolve, reject) => {
            let i = await this.dataHandle.query("select * from user where password=? and id=?", [password,userId])
            if (i != 0) {
                resolve(i);
                Global.getLogger().info(userId + "登录成功");
            } else {
                resolve(0);
                Global.getLogger().info(userId + "登录失败");
            }
        });
        return promise;
    }
}