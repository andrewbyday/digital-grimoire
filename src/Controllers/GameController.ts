import GameEngine from "../Models/Game/GameEngine.ts";
import GameView from "../Views/GameView.ts";
import {Role} from "../Models/Game/Role.ts";
import {PlayerToken} from "../Models/Physical/Token.ts";
import Player from "../Models/Game/Player.ts";

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

    public renderScene() {
        this._view.renderTokens(this._model.getTokens());
    }

    public listenJoins() {
        this._model.session.socket.on('player-join-info', (data) => {
           const role: Role | undefined = this._model.scriptSheetRoles.get(data.role);
           const player: Player = new Player(data.name, data.pronouns, true, data.playerId);

            if (role !== undefined) {
                const token: PlayerToken = new PlayerToken(role, player, {x: 10, y: 10});
                this._view.listenJoins(token);
            }
        });
    }
}