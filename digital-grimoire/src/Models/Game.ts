import {Role} from "./Role.ts";

export default class Game {
    private readonly _session: number;                          // session id/room for the WebSocket
    private readonly _apiRoles: Map<string, Role>;              // list of roles from the api (all botc roles)
    private readonly _scripSheetRoles: Map<string, Role>;     // list of roles from the script

    /**
     * Creates a game session
     * @param {number} session
     * @param {Array<Role>} apiRoles
     * @param {Array<Role>} scriptSheetRoles
     */
    public constructor(session: number, apiRoles: Map<string, Role>, scriptSheetRoles: Map<string, Role>) {
        this._session = session;
        this._apiRoles = apiRoles;
        this._scripSheetRoles = scriptSheetRoles;
    }

    /**
     * Asynchronously creates a game session by downloading the scripts from the API and loads the roles
     * appropriately.
     * @param {number} session
     * @param {string} scriptSheetRolesURL
     */
    public static async init(session: number, scriptSheetRolesURL: string): Promise<Game> {
        const apiRolesResponse: Response = await fetch('./roles.json');
        const apiRolesData: any = await apiRolesResponse.json();

        const scriptSheetRolesResponse: Response = await fetch(scriptSheetRolesURL);
        const scriptSheetRolesData: any = await scriptSheetRolesResponse.json();

        let apiRolesMap: Map<string, Role> = new Map<string, Role>();
        let scriptSheetRolesMap: Map<string, Role> = new Map<string, Role>();

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

        scriptSheetRolesData.forEach((role: any) => {
            const currentRole: Role = {
                script_id: role.id,
                name: "name",
                type: "type",
                edition: "edition",
                official_icon: "icon",
                official_icon_bg: "icon_bg"
            };
            scriptSheetRolesMap.set(role.set_id, currentRole);
        });

        return new Game(session, apiRolesMap, scriptSheetRolesMap);
    }

    /**
     * Return an array of roles from the api
     */
    public apiRoles(): Map<string, Role> {
        return this._apiRoles;
    }

    /**
     * Return an array of roles from the script
     */
    public scriptSheetRoles(): Map<string, Role> {
        return this._scripSheetRoles;
    }

    /**
     * Return the session id number for the WebSocekt room
     */
    public session(): number {
        return this._session;
    }
}