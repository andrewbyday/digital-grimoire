import Player from "../Game/Player.ts";
import NightSheet from "./NightSheet.ts";
import {PlayerToken, FabledToken} from "./Token.ts";
import Shroud from "./Shroud.ts";
import {Role} from "../Game/Role.ts";

/**
 * Define the layers for the board game
 */
export enum BoardLayers {
    BASE,
    BUTTONS,
    TOKENS_AND_SHROUDS,
    NIGHT_SHEETS,
    TOKEN_DRAWER,
    SETTINGS
}

export default class Board {
    private readonly _width: number;
    private readonly _height: number;

    private readonly _layers: Set<BoardLayers>;

    private readonly _scriptRoles: Set<Role>;

    private _scriptRoleTokens: Set<PlayerToken>;
    private _travelerTokens: Set<PlayerToken>;
    private _fabledTokens: Set<FabledToken>;
    private _players: Set<Player>;

    private _firstNightSheet: NightSheet;
    private _otherNightSheet: NightSheet;

    private readonly _shrouds: Set<Shroud>;

    private _trash: Set<PlayerToken|FabledToken|Shroud>;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;

        this._layers = new Set<BoardLayers>();

        this._scriptRoles = new Set<Role>();

        this._scriptRoleTokens = new Set<PlayerToken>();
        this._travelerTokens = new Set<PlayerToken>();
        this._fabledTokens = new Set<FabledToken>();
        this._players = new Set<Player>();

        this._firstNightSheet = new NightSheet(this._scriptRoles);
        this._otherNightSheet = new NightSheet(this._scriptRoles);

        this._shrouds = new Set<Shroud>();

        this._trash = new Set();
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get layers(): Set<BoardLayers> {
        return this._layers;
    }

    public get scriptRoles(): Set<Role> {
        return this._scriptRoles;
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

    public set trash(trash: Set<PlayerToken|FabledToken|Shroud>) {
        this._trash = trash;
    }
    public get trash(): Set<PlayerToken|FabledToken|Shroud> {
        return this._trash;
    }
}