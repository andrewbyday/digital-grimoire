import {Role} from "./Role.ts";
import Board from "../Physical/Board.ts";
import Session from "./Session.ts";
import Token from "../Physical/Token.ts";
import Player from "./Player.ts";
import TokenPlayer from "../Physical/TokenPlayer.ts";

export default class GameEngine {
    private readonly _session: Session;                         // session id/room for the WebSocket
    private readonly _apiRoles: Map<string, Role>;              // list of roles from the api (all botc roles)
    private readonly _scripSheetRoles: Map<string, Role>;       // list of roles from the script
    private _board: Board;                                      // Board

    private _players: number;

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
        this._players = 0;
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
        const api_key: string | undefined = process.env.API_KEY;

        console.log(api_url);
        console.log(api_key);

        let apiRolesResponse: Response;

        try {
            apiRolesResponse = await fetch(api_url, {
                headers: {
                    'Authorization': "Api-Key " + api_key,
                }
            });
        } catch(error) {
            apiRolesResponse = await fetch('./roles.json');
        }

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
                official_icon_bg: role.edition.official_token_bg,
                firstNightOrder: role.night_order.first,
                otherNightOrder: role.night_order.other,
                reminders: role.reminders
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

            tokens.add(new Token(role, {x: spaceX, y: spaceY}));
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

    public get players(): number {
        return this._players;
    }

    public set players(value: number) {
        this._players = value;
    }

    /**
     * Adds a player to the game.
     *
     * @param {string} inputPlayerId Unique ID for the user
     * @param {string} inputName User's Name
     * @param {string} inputPronouns User's Pronouns
     * @param {string} inputRole User's Role
     */
    public addPlayer(inputPlayerId: string, inputName: string, inputPronouns: string, inputRole: string): TokenPlayer {
        let role: Role | undefined = this._scripSheetRoles.get(inputRole);
        const player: Player = new Player(inputName, inputPronouns, true, inputPlayerId);
        this._players++;

        if (role === undefined) {
            role = {
                edition: "",
                firstNightOrder: [],
                name: "",
                official_icon: "",
                official_icon_bg: "",
                otherNightOrder: [],
                script_id: "string",
                type: ""
            }
        }

        return new TokenPlayer(role, player, {x: 50, y: 50});
    }

    public getScriptTokens(): Set<Token> {
        let tokens: Set<Token> = new Set();
        let spaceY: number = 20;

        for (let role of this._scripSheetRoles.values()) {
            tokens.add(new Token(role, {x: 20, y: spaceY}));
            spaceY += 135;
        }

        return tokens;
    }

    public getTravellerTokens(): Set<Token> {
        let tokens: Set<Token> = new Set();
        let spaceY: number = 20;

        for (let role of this._apiRoles.values()) {
            if (role.type === 'traveller' || role.type === 'traveler') {
                tokens.add(new Token(role, {x: 20, y: spaceY}));
                spaceY += 135;
            }
        }

        return tokens;
    }

    public getFabledTokens(): Set<Token> {
        let tokens: Set<Token> = new Set();
        let spaceY: number = 20;

        for (let role of this._apiRoles.values()) {
            if (role.type === 'fabled') {
                tokens.add(new Token(role, {x: 20, y: spaceY}));
                spaceY += 135;
            }
        }

        return tokens;
    }

    public getScriptRoles(): Set<Role> {
        let roles: Set<Role> = new Set();

        for (let role of this._scripSheetRoles.values()) {
            roles.add(role);
        }

        return roles;
    }
}