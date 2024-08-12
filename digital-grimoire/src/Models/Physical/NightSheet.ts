import {Role} from "../Game/Role.ts";

export default class NightSheet {
    private readonly _roles: Set<Role>;

    constructor(roles: Set<Role>) {
        this._roles = roles;
    }

    public get roles(): Set<Role> {
        return this._roles;
    }
}