import './style.css';
import './assets/fonts/Dumbledore/dum1.ttf';
import GameEngine from './Models/Game/GameEngine.ts'
import Session from "./Models/Game/Session.ts";
import GameView from "./Views/GameView.ts";
import GameController from "./Controllers/GameController.ts";
import {io, Socket} from "socket.io-client";

class main {
    private readonly _client: Socket;

    constructor() {
        this._client = io(import.meta.env.VITE_WEBSOCKET_SERVER);
        this._client.emit('join-lobby', '42');
    }

    public async startGame(): Promise<GameController> {
        const model: GameEngine = await GameEngine.init(window, new Session(this._client), './trouble_brewing.json');
        const view: GameView = await GameView.init(model.board, this._client);

        return new GameController(model, view);
    }

    public get client(): Socket {
        return this._client;
    }
}

const app: main = new main();

app.client.on('hello', (args) => {
    console.log(args);
});

app.startGame().then((game: GameController): void => {
    console.log('game', game);
    // game.renderScene();
    game.listenJoins();
});