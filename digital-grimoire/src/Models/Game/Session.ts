export default class Session {
    private readonly _id: number;
    private readonly _webSocket: WebSocket;

    constructor() {
        this._id = this.generateId();
        this._webSocket = new WebSocket("ws://localhost:8080");
    }

    public get id(): number {
        return this._id;
    }

    public get webSocket(): WebSocket {
        return this._webSocket;
    }

    private generateId() {
        return 0;
    }
}