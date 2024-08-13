import './style.css'
import GameEngine from './Models/Game/GameEngine.ts'
import Session from "./Models/Game/Session.ts";
import GameView from "./Views/GameView.ts";
import GameController from "./Controllers/GameController.ts";

class main {
    constructor() { }

    public async startGame(): Promise<void> {
        const model: GameEngine = await GameEngine.init(window.screen, new Session(), './trouble_brewing.json');
        const view: GameView = await GameView.init(model.board);

        const game: GameController = new GameController(model, view);

        game.view.renderTokens(game.model.getTokens());

        console.log(game.model.getTokens());
    }
}

const app: main = new main();
app.startGame().then(() => console.log('Game started!'));