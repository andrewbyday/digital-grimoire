import './style.css'
import Game from './Models/Game.ts'

class main {
    constructor() {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `Hello World!`
    }

    public async startGame(): Promise<Game> {
        return Game.init(1,'./trouble_brewing.json');
    }
}

const app: main = new main();
const game: Game = await app.startGame();
console.log(game.scriptSheetRoles);