import Player from "../Game/Player.ts";
import NightSheet from "./NightSheet.ts";
import {FabledToken, RoleToken, TravelerToken} from "./Token.ts";
import Shroud from "./Shroud.ts";

export default class Board {
    private readonly _width: number;
    private readonly _height: number;

    private _scriptRoleTokens: Set<RoleToken>;
    private _travelerTokens: Set<TravelerToken>;
    private _fabledTokens: Set<FabledToken>;
    private _players: Set<Player>;

    private _firstNightSheet: NightSheet;
    private _otherNightSheet: NightSheet;

    private readonly _shrouds: Set<Shroud>;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;

        this._scriptRoleTokens = new Set<RoleToken>();
        this._travelerTokens = new Set<TravelerToken>();
        this._fabledTokens = new Set<FabledToken>();
        this._players = new Set<Player>();

        this._firstNightSheet = new NightSheet();
        this._otherNightSheet = new NightSheet();

        this._shrouds = new Set<Shroud>();
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get shrouds(): Set<Shroud> {
        return this._shrouds;
    }

    public get otherNightSheet(): NightSheet {
        return this._otherNightSheet;
    }
    public set otherNightSheet(value: NightSheet) {
        this._otherNightSheet = value;
    }

    public get firstNightSheet(): NightSheet {
        return this._firstNightSheet;
    }
    public set firstNightSheet(value: NightSheet) {
        this._firstNightSheet = value;
    }

    public get players(): Set<Player> {
        return this._players;
    }
    public set players(value: Set<Player>) {
        this._players = value;
    }

    public get fabledTokens(): Set<FabledToken> {
        return this._fabledTokens;
    }
    public set fabledTokens(value: Set<FabledToken>) {
        this._fabledTokens = value;
    }

    public get travelerTokens(): Set<TravelerToken> {
        return this._travelerTokens;
    }
    public set travelerTokens(value: Set<TravelerToken>) {
        this._travelerTokens = value;
    }

    public get scriptRoleTokens(): Set<RoleToken> {
        return this._scriptRoleTokens;
    }
    public set scriptRoleTokens(value: Set<RoleToken>) {
        this._scriptRoleTokens = value;
    }
}