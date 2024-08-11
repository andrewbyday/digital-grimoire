import './style.css'
import GameEngine from './Models/Game/GameEngine.ts'

class main {
    constructor() {
        const url = import.meta.env.VITE_ROLES_API_URL;

        document.querySelector<HTMLDivElement>('#app')!.innerHTML =
            `
            <p>
                Hello World!
            </p>
            <p>
                API URL: ${url}
            </p>
            `;
    }

    public async startGame() {
        const game: GameEngine = await GameEngine.init(window.screen,1,'./trouble_brewing.json');
        console.log(game.scriptSheetRoles);
    }
}

const app: main = new main();
app.startGame();