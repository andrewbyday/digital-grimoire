import './style.css'
import Game from './Models/Game.ts'

class main {
    constructor() {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `Hello World!`
    }

    public async startGame() {
        const game: Game = await Game.init(1,'./roles.json');
        console.log(game.apiRoles());
    }
}

const app: main = new main();
app.startGame();