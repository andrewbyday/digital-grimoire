import {Role} from "./Role.ts";
import Board from "../Physical/Board.ts";
import Session from "./Session.ts";
import Token from "../Physical/Token.ts";

export default class GameEngine {
    private readonly _session: Session;                         // session id/room for the WebSocket
    private readonly _apiRoles: Map<string, Role>;              // list of roles from the api (all botc roles)
    private readonly _scripSheetRoles: Map<string, Role>;       // list of roles from the script

    private _board: Board;                                      // Board

    /**
     * Creates a game session
     * @param {Window} window
     * @param {number} session
     * @param {Array<Role>} apiRoles
     * @param {Array<Role>} scriptSheetRoles
     */
    public constructor(window: Window, session: Session, apiRoles: Map<string, Role>, scriptSheetRoles: Map<string, Role>) {
        this._session = session;
        this._apiRoles = apiRoles;
        this._scripSheetRoles = scriptSheetRoles;
        this._board = new Board(window.innerWidth, window.innerHeight);
    }

    /**
     * Asynchronously creates a game session by downloading the scripts from the API and loads the roles
     * appropriately.
     * @param {Window} window
     * @param {Session} session
     * @param {string} scriptSheetRolesURL
     */
    public static async init(window: Window, session: Session, scriptSheetRolesURL: string): Promise<GameEngine> {
        const api_url: string = import.meta.env.VITE_ROLES_API_URL;
        const apiRolesResponse: Response = await fetch(api_url);
        const apiRolesData: any = await apiRolesResponse.json();

        const scriptSheetRolesResponse: Response = await fetch(scriptSheetRolesURL);
        const scriptSheetRolesData: any = await scriptSheetRolesResponse.json();

        let apiRolesMap: Map<string, Role> = new Map<string, Role>();
        let scriptSheetRolesMap: Map<string, Role> = new Map<string, Role>();

        // create roles from the api
        apiRolesData.forEach((role: any) => {
            const currentRole: Role = {
                script_id: role.script_id,
                name: role.name,
                type: role.type,
                edition: role.edition.code,
                official_icon: role.icons.official.png_textured,
                official_icon_bg: role.edition.official_token_bg
            };
            apiRolesMap.set(role.script_id, currentRole);
        });

        // search for roles and assign
        scriptSheetRolesData.forEach((role: any) => {
            if (apiRolesMap.has(role.id)) {
                const currentRole: Role = apiRolesMap.get(role.id)!;
                scriptSheetRolesMap.set(role.id, currentRole);
            }
        });

        return new GameEngine(window, session, apiRolesMap, scriptSheetRolesMap);
    }

    /**
     * Return an array of roles from the api
     */
    public get apiRoles(): Map<string, Role> {
        return this._apiRoles;
    }

    /**
     * Return an array of roles from the script
     */
    public get scriptSheetRoles(): Map<string, Role> {
        return this._scripSheetRoles;
    }

    public getTokens(): Set<Token> {
        let tokens: Set<Token> = new Set();

        let spaceX: number = 10;
        let spaceY: number = 10;
        let index: number = 0;

        for (let role of this._scripSheetRoles.values()) {
            if (index === 6) {
                spaceX = 10;
                spaceY += 135;
                index = 0;
            }
            const currtoken: Token = new Token(role, {x: spaceX, y: spaceY});
            tokens.add(currtoken);
            spaceX += 135;
            index++;
        }

        return tokens;
    }

    /**
     * Return the session id number for the WebSocekt room
     */
    public get session(): Session {
        return this._session;
    }

    /**
     * Return the board
     */
    public get board() {
        return this._board;
    }

    /**
     * Set the current board to a new or different board
     * @param board
     */
    public set board(board: Board) {
        this._board = board;
    }
}