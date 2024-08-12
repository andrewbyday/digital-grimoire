export default class Session {
    private readonly _roomUUID: string;               // room to join
    private readonly _clientUUID: string;             // unique id generated by the server
    private readonly _webSocket: WebSocket;         // WebSocket for client-server transmission

    constructor() {
        const ws: WebSocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_SERVER);

        this._webSocket = ws;
        this._roomUUID = this.generateRoomId(ws);
        this._clientUUID = this.retrieveClientId(ws);
    }

    /**
     * Returns the room's id
     */
    public get roomUUID(): string {
        return this._roomUUID;
    }

    /**
     * Returns the current client's id from the WebSocket server
     */
    public get clientUUID(): string {
        return this._clientUUID;
    }

    /**
     * Return the client's WebSocket
     */
    public get webSocket(): WebSocket {
        return this._webSocket;
    }

    /**
     * Generate a unique room id from the server
     * @param {WebSocket} webSocket
     * @private
     */
    private generateRoomId(webSocket: WebSocket): string {
        webSocket.addEventListener('message', (e: MessageEvent) => {
           e.preventDefault();
        });
        return "";
    }

    /**
     * Retrieve the client's id from the WebSocket server
     * @param {WebSocket} webSocket
     * @private
     */
    private retrieveClientId(webSocket: WebSocket): string {
        webSocket.addEventListener('message', (e: MessageEvent) => {
            e.preventDefault();
        });
        return "";
    }
}