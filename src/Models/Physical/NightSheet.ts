import {Role} from "../Game/Role.ts";
import Konva from "konva";

export default class NightSheet {
    private readonly _roles: Set<Role>;
    private readonly _group: Konva.Group;

    constructor(roles: Set<Role>, type: string) {
        this._roles = roles;

        let bg_url = '';
        if (type === 'first') {

        } else {

        }

        this._group = new Konva.Group({

        });
    }

    public get roles(): Set<Role> {
        return this._roles;
    }

    public renderSheet(): Konva.Group {
        return this._group;
    }
}