import GameEngine from "../Models/Game/GameEngine.ts";
import Player from "../Models/Game/Player.ts";
import Token from "../Models/Physical/Token.ts";
import Shroud from "../Models/Physical/Shroud.ts";
import NightSheet from "../Models/Physical/NightSheet.ts";
import Board from "../Models/Physical/Board.ts";

export default class GameView {
    private _game: GameEngine;

    constructor(game: GameEngine) {
        this._game = game;
    }

    public get game(): GameEngine {
        return this._game;
    }

    public set game(game: GameEngine) {
        this._game = game;
    }

    public renderBoard(board: Board) {

    }

    public renderToken(token: Token): void {

    }

    public renderTokens(tokens: Set<Token>): void {

    }

    public renderPlayerToken(player: Player): void {

    }

    public renderPlayerTokens(players: Set<Player>): void {

    }

    public renderShroudToken(shroud: Shroud): void {

    }

    public renderShroudTokens(shrouds: Set<Shroud>): void {

    }

    public renderNightSheet(nightSheet: NightSheet): void {

    }

    public renderNightSheets(nightSheets: Set<NightSheet>): void {

    }
}