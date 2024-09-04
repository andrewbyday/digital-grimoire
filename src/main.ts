import './style.css';
import './assets/fonts/Dumbledore/dum1.ttf';
import GameEngine from './Models/Game/GameEngine.ts'
import Session from "./Models/Game/Session.ts";
import GameView from "./Views/GameView.ts";
import GameController from "./Controllers/GameController.ts";
import {io, Socket} from "socket.io-client";
import { Modal } from "bootstrap";

class main {
    private readonly _client: Socket;

    constructor() {
        this._client = io(import.meta.env.VITE_WEBSOCKET_SERVER);
    }

    public async startGame(sessionCode:string, scriptURL:string): Promise<GameController> {
        const model: GameEngine = await GameEngine.init(window, new Session(this._client, sessionCode), scriptURL);
        const view: GameView = await GameView.init(model.board, this._client);
        return new GameController(model, view);
    }

    public get client(): Socket {
        return this._client;
    }
}

const startGameModalElement: HTMLElement = document.getElementById('startGameModal') as HTMLElement;
const startGameModal = new Modal(startGameModalElement);

window.onload = (e): void => {
    e.preventDefault();
    startGameModal.show();
};

window.addEventListener("scroll", (e) => {
    e.preventDefault();
    window.scrollTo(0,0);
});

let hostButton: HTMLButtonElement | null = document.getElementById('hostButton') as HTMLButtonElement;
let sessionCode: HTMLInputElement | null = document.getElementById('sessionCode') as HTMLInputElement;
let baseThreeSelect: HTMLSelectElement | null = document.getElementById('baseThreeSelect') as HTMLSelectElement;

if (hostButton && sessionCode && baseThreeSelect) {
    hostButton.addEventListener('click', () => {
        const app: main = new main();

        const sessionCodeValue: string = sessionCode.value ? sessionCode.value : "42";
        const baseThreeSelectValue: string = baseThreeSelect.value ? baseThreeSelect.value : "./scripts/trouble_brewing.json";

        app.client.on('hello',  (args) => {
            console.log(args);
        });

        app.startGame(sessionCodeValue, baseThreeSelectValue).then((game: GameController): void => {
            console.log('game', game);
            // game.renderScene();
            game.listenJoins();
        });

        startGameModal.hide();
    })
}