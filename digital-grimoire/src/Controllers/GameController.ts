import GameEngine from "../Models/Game/GameEngine.ts";
import GameView from "../Views/GameView.ts";

export default class GameController {
    private _model: GameEngine;
    private _view: GameView;

    constructor(model: GameEngine, view: GameView) {
        this._model = model;
        this._view = view;
    }

    public handleAddPlayer(name: string, pronouns: string, role: string) {

    }

    public handleAddToken() {

    }

    public handleAddNightSheet() {

    }
}