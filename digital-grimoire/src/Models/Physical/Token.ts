import {Role} from "../Game/Role.ts";
import Player from "../Game/Player.ts";

export default class Token {
    private _role: Role;
    private _boardPosition: { x: number; y: number };

    constructor(role: Role, position: { x: number; y: number }) {
        this._role = role;
        this._boardPosition = position;
    }

    public get role() {
        return this._role;
    }
    public set role(role: Role) {
        this._role = role;
    }

    public get boardPosition(): { x: number; y: number } {
        return this._boardPosition;
    }
    public set boardPosition(position: { x: number; y: number }) {
        this._boardPosition = position;
    }
}

export class PlayerToken extends Token {
    private _player: Player;

    constructor(role: Role, player: Player, position: { x: number; y: number }) {
        super(role, position);

        this._player = player;
    }

    public get player(): Player {
        return this._player;
    }
}

export class FabledToken extends Token {
    constructor(role: Role, position: { x: number; y: number }) {
        super(role, position);
    }
}