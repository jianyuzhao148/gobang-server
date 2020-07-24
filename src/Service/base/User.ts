import socket from "socket.io";
export abstract class User {
    private _id: string = "";
    public get id() {
        return this._id;
    }
    public set id(id: string) {
        this._id = id;
    }

    private _password: string = "";
    public get password() {
        return this._password;
    }
    public set password(password: string) {
        this._password = password;
    }

    private _name: string = "";
    public get name() {
        return this._name;
    }
    public set name(name: string) {
        this._name = name
    }

    private _title: string = "";
    public get title() {
        return this._title;
    }
    public set title(title: string) {
        this._title = title;
    }

    private _total: number = 0;
    public get total() {
        return this._total;
    }
    public set total(total: number) {
        this._total = total;
    }

    private _winning_probability: number = 0;
    public get winning_probability() {
        return this._winning_probability;
    }
    public set winning_probability(winning_probability: number) {
        this._winning_probability = winning_probability;
    }

    public _wealth: number = 0;
    public get wealth() {
        return this._wealth;
    }
    public set wealth(wealth: number) {
        this._wealth = wealth;
    }
}