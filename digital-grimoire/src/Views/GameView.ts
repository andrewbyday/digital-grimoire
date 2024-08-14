import Token from "../Models/Physical/Token.ts";
import Board from "../Models/Physical/Board.ts";
import Konva from "konva";
import {Stage} from "konva/lib/Stage";

export default class GameView {
    private readonly _stage: Stage;

    constructor(stage: Stage) {
        this._stage = stage;
    }

    public static async init(board: Board): Promise<GameView> {
        const stage: Stage = new Konva.Stage({
            container: 'app',
            width: board.width,
            height: board.height,
        });

        return new GameView(stage);
    }

    public get stage(): Stage {
        return this._stage;
    }

    public renderTokens(tokens: Set<Token>): void {
        let layer: Konva.Layer = new Konva.Layer();
        tokens.forEach((token: Token) => {
            layer.add(token.group);
        });
        this._stage.add(layer);
    }
}