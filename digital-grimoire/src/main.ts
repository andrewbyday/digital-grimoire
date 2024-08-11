import './style.css'
import GameEngine from './Models/Game/GameEngine.ts'
import Session from "./Models/Game/Session.ts";

class main {
    constructor() {
        const url: string = import.meta.env.VITE_ROLES_API_URL;

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

    public async startGame(): Promise<void> {
        const session: Session = new Session();

        const game: GameEngine = await GameEngine.init(window.screen,session, './trouble_brewing.json');
        console.log(game.scriptSheetRoles);
    }
}

const app: main = new main();
app.startGame().then(r => console.log(r));