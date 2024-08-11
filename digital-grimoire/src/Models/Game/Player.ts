import {PlayerToken} from "../Physical/Token.ts";

export default class Player {
    private _name: string;
    private _pronouns: string;
    private _token: PlayerToken;
    private _alive: boolean = true;
    private readonly _wsID: string;

    constructor(name: string, pronouns: string, token: PlayerToken, alive: boolean, wsID: string) {
        this._name = name;
        this._pronouns = pronouns;
        this._token = token;
        this._alive = alive;
        this._wsID = wsID;
    }

    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
    }

    public get pronouns(): string {
        return this._pronouns;
    }
    public set pronouns(pronouns: string) {
        this._pronouns = pronouns;
    }

    public get token(): PlayerToken {
        return this._token;
    }
    public set token(token: PlayerToken) {
        this._token = token;
    }

    public get alive(): boolean {
        return this._alive;
    }
    public set alive(alive: boolean) {
        this._alive = alive;
    }

    public get wsID(): string {
        return this._wsID;
    }
}