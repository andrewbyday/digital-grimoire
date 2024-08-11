import Player from "../Game/Player.ts";
import NightSheet from "./NightSheet.ts";
import {PlayerToken, FabledToken} from "./Token.ts";
import Shroud from "./Shroud.ts";

export default class Board {
    private readonly _width: number;
    private readonly _height: number;

    private _scriptRoleTokens: Set<PlayerToken>;
    private _travelerTokens: Set<PlayerToken>;
    private _fabledTokens: Set<FabledToken>;
    private _players: Set<Player>;

    private _firstNightSheet: NightSheet;
    private _otherNightSheet: NightSheet;

    private readonly _shrouds: Set<Shroud>;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;

        this._scriptRoleTokens = new Set<PlayerToken>();
        this._travelerTokens = new Set<PlayerToken>();
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

    public get travelerTokens(): Set<PlayerToken> {
        return this._travelerTokens;
    }
    public set travelerTokens(value: Set<PlayerToken>) {
        this._travelerTokens = value;
    }

    public get scriptRoleTokens(): Set<PlayerToken> {
        return this._scriptRoleTokens;
    }
    public set scriptRoleTokens(value: Set<PlayerToken>) {
        this._scriptRoleTokens = value;
    }
}