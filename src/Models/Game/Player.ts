export default class Player {
    private _name: string;
    private _pronouns: string;
    private _alive: boolean = true;
    private readonly _uuid: string;

    constructor(name: string, pronouns: string, alive: boolean, uuid: string) {
        this._name = name;
        this._pronouns = pronouns;
        this._alive = alive;
        this._uuid = uuid;
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
     * Get the uuid for the client from the WebSocket server
     */
    public get uuid(): string {
        return this._uuid;
    }
}