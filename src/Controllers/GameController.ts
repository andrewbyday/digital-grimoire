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

    public renderScene(): void {
        this._view.renderPlayerTokenRoleOptions(
            this._model.getScriptRoles()
        );

        this._view.renderButtons();
        this._view.renderNightActionCards();
        this._view.hideDrawer();

        this._view.renderDrawer(
            this._model.getScriptTokens(),
            this._model.getTravellerTokens(),                    
            this._model.getFabledTokens()
        );

        this._view.renderPutAwayDrawer();

        this._view.renderNightSheet(
            this._model.getScriptRoles()
        );
    }

    public createListeners(): void {
        this._view.createListeners(
            this._model.getScriptRoles()
        );
    }

    public listenJoins(): void {
        const playerInputSchema = z.object({
            playerId: z.string(),
            name: z.string(),
            pronouns: z.string(),
            role: z.string()
        });

        type PlayerInput = z.infer<typeof playerInputSchema>;

        this._model.session.socket.on('player-join-info', (data: PlayerInput): void => {
            this._view.listenJoins(
                this._model.addPlayer(
                    data.playerId,
                    data.name,
                    data.pronouns,
                    data.role
                )
            );
        });
    }
}
