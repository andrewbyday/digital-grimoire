import Player from "../Models/Game/Player.ts";
import Token from "../Models/Physical/Token.ts";
import Shroud from "../Models/Physical/Shroud.ts";
import NightSheet from "../Models/Physical/NightSheet.ts";
import Board from "../Models/Physical/Board.ts";
import Konva from "konva";
import {Stage} from "konva/lib/Stage";
import {Layer} from "konva/lib/Layer";

export default class GameView {
    private readonly _stage: Stage;

    constructor(stage: Stage) {
        this._stage = stage;
    }

    public static async init(board: Board): Promise<GameView> {
        const stage: Stage = new Konva.Stage({
            container: 'app',
            width: board.width,
            height: board.height,
        });

        return new GameView(stage);
    }

    public get stage(): Stage {
        return this._stage;
    }

    public renderBoard() {

    }

    public renderToken(token: Token): void {

    }

    public renderTokens(tokens: Set<Token>): void {
        const layer: Layer = new Konva.Layer();
        const radius: number = 125/2;

        let images = new Array();

        let index: number = 0;
        tokens.forEach(token => {
            if ( index === 0 ) {
                images.push(this.loadImage(token.role.official_icon_bg));
                index++;
            }
            images.push(this.loadImage(token.role.official_icon));
        });

        Promise.all(images).then( (result) => {
            let index: number = 1;
            tokens.forEach(async (token) => {
                const group = new Konva.Group({
                    x: token.boardPosition.x,
                    y: token.boardPosition.y,
                    draggable: true
                });

                // create border
                const circle: Konva.Circle = new Konva.Circle({
                    x: radius,
                    y: radius,
                    radius: radius,
                    stroke: 'black',
                    strokeWidth: 4,
                    fill: 'white',
                });

                // create image
                const roleBg = new Konva.Image({
                    x: 0,
                    y: 0,
                    width: 125,
                    height: 125,
                    image: result[0]
                });

                // create image
                const roleImg = new Konva.Image({
                    x: 0,
                    y: 0,
                    width: 125,
                    height: 125,
                    image: result[index++]
                });

                group.add(circle);
                group.add(roleBg);
                group.add(roleImg);
                layer.add(group);
            });
            this._stage.add(layer);
        });
    }

    public renderPlayerToken(player: Player): void {

    }

    public renderPlayerTokens(players: Set<Player>): void {

    }

    public renderShroudToken(shroud: Shroud): void {

    }

    public renderShroudTokens(shrouds: Set<Shroud>): void {

    }

    public renderNightSheet(nightSheet: NightSheet): void {

    }

    public renderNightSheets(nightSheets: Set<NightSheet>): void {

    }

    private loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
           const img: HTMLImageElement = new Image();
           img.src = url;
           img.onload = function() {
               resolve(img);
           }
           img.onerror = function() {
               reject(img);
           }
        });
    }
}