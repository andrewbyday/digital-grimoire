import './style.css';
import './assets/fonts/Dumbledore/dum1.ttf';
import GameEngine from './Models/Game/GameEngine.ts'
import Session from "./Models/Game/Session.ts";
import GameView from "./Views/GameView.ts";
import GameController from "./Controllers/GameController.ts";
import { io } from "socket.io-client";
import * as fs from 'fs';

class main {
    constructor() {
        const client = io("https://joinapp.shinpostudios.com", {
            ca: fs.readFileSync("/app/server/tls/server.letsencrypt.crt", "utf-8")
        });
        client.on('hello', (args) => {
            console.log(args);
        });
    }

    public async startGame(): Promise<GameController> {
        const model: GameEngine = await GameEngine.init(window, new Session(), './trouble_brewing.json');
        const view: GameView = await GameView.init(model.board);

        return new GameController(model, view);
    }
}

const app: main = new main();
app.startGame().then((game: GameController): void => {
    console.log('game', game);
    game.renderScene();
});
