import {PlayerToken} from "../Physical/Token.ts";
import Session from "./Session.ts";

export default class Player {
    private _name: string;
    private _pronouns: string;
    private _token: PlayerToken;
    private _alive: boolean = true;
    private readonly _uuid: string;
    private readonly _session: Session;

    constructor(name: string, pronouns: string, token: PlayerToken, alive: boolean, session: Session) {
        this._name = name;
        this._pronouns = pronouns;
        this._token = token;
        this._alive = alive;
        this._uuid = session.clientUUID;
        this._session = session;
    }

    /**
     * Get the players name
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Set the player's name
     * @param {string} name
     */
    public set name(name: string) {
        this._name = name;
    }

    /**
     * Get the player's pronouns
     */
    public get pronouns(): string {
        return this._pronouns;
    }

    /**
     * Set the player's pronouns
     * @param {string} pronouns
     */
    public set pronouns(pronouns: string) {
        this._pronouns = pronouns;
    }

    /**
     * Get the player's token
     */
    public get token(): PlayerToken {
        return this._token;
    }

    /**
     * Set the player's token
     * @param {PlayerToken} token
     */
    public set token(token: PlayerToken) {
        this._token = token;
    }

    /**
     * Return if the player is alive or dead (shrouded)
     */
    public get alive(): boolean {
        return this._alive;
    }

    /**
     * Set the player to be alive or dead (shrouded)
     * @param {boolean} alive
     */
    public set alive(alive: boolean) {
        this._alive = alive;
    }

    /**
     * Get client's session
     */
    public get session(): Session {
        return this._session;
    }

    /**
     * Get the uuid for the client from the WebSocket server
     */
    public get uuid(): string {
        return this._uuid;
    }
}