export default class Session {
    private readonly _id: number;

    constructor() {
        this._id = this.generateId();
    }

    public get id(): number {
        return this._id;
    }

    public generateId() {
        return 0;
    }
}