import './style.css'
import GameEngine from './Models/Game/GameEngine.ts'

class main {
    constructor() {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `Hello World!`
    }

    public async startGame(): Promise<GameEngine> {
        return GameEngine.init(window.screen,1,'./trouble_brewing.json');
    }
}

const app: main = new main();
const game: GameEngine = await app.startGame();
console.log(game.scriptSheetRoles);