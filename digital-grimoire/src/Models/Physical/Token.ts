import {Role} from "../Game/Role.ts";
import Player from "../Game/Player.ts";

export default class Token {
    private _role: Role;

    constructor(role: Role) {
        this._role = role;
    }

    public get role() {
        return this._role;
    }
    public set role(role: Role) {
        this._role = role;
    }
}

export class PlayerToken extends Token {
    private _player: Player;

    constructor(role: Role, player: Player) {
        super(role);

        this._player = player;
    }

    public get player(): Player {
        return this._player;
    }
}

export class FabledToken extends Token {
    constructor(role: Role) {
        super(role);
    }
}