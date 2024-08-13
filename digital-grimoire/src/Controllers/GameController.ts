import GameEngine from "../Models/Game/GameEngine.ts";
import GameView from "../Views/GameView.ts";

export default class GameController {
    private readonly _model: GameEngine;
    private readonly _view: GameView;

    constructor(model: GameEngine, view: GameView) {
        this._model = model;
        this._view = view;
    }

    public get model(): GameEngine {
        return this._model;
    }

    public get view(): GameView {
        return this._view;
    }

    public handleAddPlayer(name: string, pronouns: string, role: string) {

    }

    public handleAddToken() {

    }

    public handleAddNightSheet() {

    }
}