import Token, {PlayerToken} from "../Models/Physical/Token.ts";
import Board from "../Models/Physical/Board.ts";
import Konva from "konva";
import {Stage} from "konva/lib/Stage";
import {Socket} from "socket.io-client";

export default class GameView {
    private readonly _stage: Stage;
    private readonly _socket: Socket;
    private readonly _tokenLayer: Konva.Layer;

    constructor(stage: Stage, socket: Socket) {
        this._stage = stage;
        this._socket = socket;

        this._tokenLayer = new Konva.Layer();
        this._stage.add(this._tokenLayer);
    }

    public static async init(board: Board, socket: Socket): Promise<GameView> {
        const stage: Stage = new Konva.Stage({
            container: 'app',
            width: board.width,
            height: board.height,
        });

        return new GameView(stage, socket);
    }

    public get stage(): Stage {
        return this._stage;
    }

    public get socket(): Socket {
        return this._socket;
    }

    public renderTokens(tokens: Set<Token>): void {
        tokens.forEach((token: Token) => {
            this._tokenLayer.add(token.group);
        });
    }

    public listenJoins(token: PlayerToken): void {
        this._tokenLayer.add(token.group);
    }
}