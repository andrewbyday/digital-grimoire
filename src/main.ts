import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
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

window.addEventListener("scroll", (e: Event): void => {
    e.preventDefault();
    window.scrollTo(0,0);
});

let hostButton: HTMLButtonElement | null = document.getElementById('hostButton') as HTMLButtonElement;
let sessionCode: HTMLInputElement | null = document.getElementById('sessionCode') as HTMLInputElement;
let baseThreeSelect: HTMLSelectElement | null = document.getElementById('baseThreeSelect') as HTMLSelectElement;
let customScriptButton: HTMLInputElement | null = document.getElementById('customScriptButton') as HTMLInputElement;
let baseThreeSelector: HTMLElement | null = document.getElementById('baseThreeSelector') as HTMLElement;
let scriptUrl: HTMLInputElement | null = document.getElementById('scriptUrl') as HTMLInputElement;

if (customScriptButton && baseThreeSelector) {
    customScriptButton.addEventListener('click', (): void => {
        const status: boolean = customScriptButton.checked;
        const scriptUrlRow: HTMLElement = document.getElementById('scriptUrlRow') as HTMLElement;

        if (status) {
            scriptUrlRow.className = 'form-group row';
            baseThreeSelector.className = 'form-group row d-none';
        } else {
            scriptUrlRow.className = 'form-group row d-none';
            baseThreeSelector.className = 'form-group row';
        }
    });
}


if (hostButton && sessionCode && baseThreeSelect && scriptUrl) {
    hostButton.addEventListener('click', () => {
        const app: main = new main();

        const status: boolean = customScriptButton.checked;
        const sessionCodeValue: string = sessionCode.value ? sessionCode.value : "";
        const baseThreeSelectValue: string = baseThreeSelect.value ? baseThreeSelect.value : "./scripts/trouble_brewing.json";
        const customScriptValue: string = scriptUrl.value ? scriptUrl.value : "./scripts/trouble_brewing.json";

        let chosenScript: string = baseThreeSelectValue;
        if (status) {
            chosenScript = customScriptValue;
        }

        app.client.on('hello',  (args) => {
            console.log(args);
        });

        app.startGame(sessionCodeValue, chosenScript).then((game: GameController): void => {
            game.renderScene();
            game.listenJoins();
            game.createListeners();
        });
    })
}