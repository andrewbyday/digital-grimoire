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
        const orientation: ScreenOrientation = screen.orientation;

        let scale: number = (window.innerHeight/window.innerWidth)*1.5;
        if (orientation.type === "portrait-primary" || orientation.type === "portrait-secondary") {
            scale = (window.innerWidth/window.innerHeight)*1.5;
        }

        console.log(orientation);

        tokens.forEach((token: Token) => {
            console.log(scale);
            token.group.scaleX(scale);
            token.group.scaleY(scale);
            layer.add(token.group);
        });
        this._stage.add(layer);
    }
}