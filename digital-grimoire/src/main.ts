import './style.css'
import GameEngine from './Models/Game/GameEngine.ts'
import Session from "./Models/Game/Session.ts";
import GameView from "./Views/GameView.ts";
import GameController from "./Controllers/GameController.ts";

class main {
    constructor() { }

    public async startGame(): Promise<GameController> {
        const model: GameEngine = await GameEngine.init(window.screen, new Session(), './trouble_brewing.json');
        const view: GameView = await GameView.init(model.board);

        return new GameController(model, view);
    }
}

const app: main = new main();
app.startGame().then((game: GameController): void => {
    console.log('Game started!')
    game.renderScene();
});