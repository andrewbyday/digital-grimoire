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
    }

    public async startGame(scriptURL:string, sessionCode: string): Promise<GameController> {
        this._client.emit('join-lobby', sessionCode);

        const model: GameEngine = await GameEngine.init(window, new Session(this._client), scriptURL);
        const view: GameView = await GameView.init(model.board, this._client);

        return new GameController(model, view);
    }

    public get client(): Socket {
        return this._client;
    }
}

const app: main = new main();

let hostButton = document.getElementById('hostButton');
let sessionCode = document.getElementById('sessionCode') as HTMLInputElement;
let baseThreeSelect = document.getElementById('baseThreeSelect') as HTMLSelectElement;
if (hostButton && sessionCode && baseThreeSelect) {
    const choiceScript: string = baseThreeSelect.selectedOptions[baseThreeSelect.selectedIndex].value;
    const sessionId: string = sessionCode.value;

    hostButton.addEventListener('click', () => {
        app.client.on('hello', (args) => {
            console.log(args);
        });

        app.startGame(sessionId, choiceScript).then((game: GameController): void => {
            console.log('game', game);
            // game.renderScene();
            game.listenJoins();
        });
    })
}