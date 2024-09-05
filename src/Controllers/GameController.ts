import GameEngine from "../Models/Game/GameEngine.ts";
import GameView from "../Views/GameView.ts";
import { z } from "zod";

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
        const playerInputSchema = z.object({
            playerId: z.string(),
            name: z.string(),
            pronouns: z.string(),
            role: z.string()
        });

        type PlayerInput = z.infer<typeof playerInputSchema>;

        this._model.session.socket.on('player-join-info', (data: PlayerInput): void => {
            this._model.addPlayer(data.playerId, data.name, data.pronouns, data.role);
        });
    }
}