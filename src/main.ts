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

    public async startGame(sessionCode:string, scriptURL:string): Promise<GameController> {
        const model: GameEngine = await GameEngine.init(window, new Session(this._client), scriptURL);
        const view: GameView = await GameView.init(model.board, this._client);
        this._client.emit('join-lobby', sessionCode);

        return new GameController(model, view);
    }

    public get client(): Socket {
        return this._client;
    }
}

let hostButton: HTMLButtonElement | null = document.getElementById('hostButton') as HTMLButtonElement;
let baseThreeSelect: HTMLSelectElement | null = document.getElementById('baseThreeSelect') as HTMLSelectElement;
let sessionCode: HTMLInputElement | null = document.getElementById('sessionCode') as HTMLInputElement;

if (hostButton && baseThreeSelect && sessionCode) {
    const scriptSelectedValue: string = baseThreeSelect.selectedOptions[baseThreeSelect.selectedIndex].value;
    const sessionCodeValue: string = sessionCode.value;

    hostButton.addEventListener('click', () => {
        const app: main = new main();

        app.client.on('hello',  (args) => {
            console.log(args);
        });

        app.startGame(scriptSelectedValue, sessionCodeValue).then((game: GameController): void => {
            console.log('game', game);
            // game.renderScene();
            game.listenJoins();
        });
    })
}