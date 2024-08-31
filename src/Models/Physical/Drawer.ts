import Token, {FabledToken} from "./Token.ts";

export default class Drawer {
    private readonly _scriptTokens: Set<Token>;
    private readonly _travelerTokens: Set<Token>;
    private readonly _fabledTokens: Set<FabledToken>;

    constructor() {
        this._scriptTokens = new Set<Token>;
        this._travelerTokens = new Set<Token>();
        this._fabledTokens = new Set<FabledToken>();
    }

    public get scriptTokens(): Set<Token> {
        return this._scriptTokens;
    }

    public get travelerTokens(): Set<Token> {
        return this._travelerTokens;
    }

    public get fabledTokens(): Set<FabledToken> {
        return this._fabledTokens;
    }
}