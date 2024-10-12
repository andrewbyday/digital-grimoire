import {Role} from "../Game/Role.ts";
import Player from "../Game/Player.ts";
import Konva from "konva";
import SvgCircleTextPath from "../Helper/SvgCircleTextPath.ts";
import Shroud from "./Shroud.ts";

export default class TokenPlayer {
    private _role: Role;
    private _boardPosition: { x: number; y: number };
    private readonly _player: Player;
    private readonly _group: Konva.Group;
    private readonly _width: number;
    private readonly _height: number;
    private _dead: boolean;

    constructor(role: Role, player: Player, position: { x: number; y: number }, width: number = 125, height: number = 125) {
        this._role = role;
        this._boardPosition = position;
        this._group = this.createGroup(role,player,position);
        this._player = player;
        this._width = width;
        this._height = height;
        this._dead = false;
    }

    public get dead(): boolean {
        return this._dead;
    }

    public set dead(value: boolean) {
        this._dead = value;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    /**
     * Returns role
     */
    public get role() {
        return this._role;
    }

    /**
     * Sets role
     * @param {Role} role
     */
    public set role(role: Role) {
        this._role = role;
    }

    /**
     * Return player.
     */
    public get player(): Player {
        return this._player;
    }

    /**
     * Returns position on the board
     */
    public get boardPosition(): { x: number; y: number } {
        return this._boardPosition;
    }

    /**
     * Sets the position of the token on the board
     * @param position
     */
    public set boardPosition(position: { x: number; y: number }) {
        this._boardPosition = position;
    }

    /**
     * Gets the Konva.Group
     */
    public get group(): Konva.Group {
        return this._group;
    }

    /**
     * Creates the group for Konva.Layer
     * @param role
     * @param player
     * @param position
     * @private
     */
    private createGroup(role: Role, player: Player, position: { x: number; y: number }): Konva.Group {
        const group: Konva.Group = new Konva.Group({
            x: position.x,
            y: position.y,
            id: role.script_id,
            name: 'token',
            draggable: true
        });

        let bgImage: HTMLImageElement = new Image();
        bgImage.src = role.official_icon_bg;
        let roleImage: HTMLImageElement = new Image();
        roleImage.src = role.official_icon;

        Promise.all([this.loadImage(bgImage), this.loadImage(roleImage)]).then((values) => {
            const circle: Konva.Circle = new Konva.Circle({
                x: this._width/2,
                y: this._height/2,
                radius: this._width/2,
                stroke: 'black',
                strokeWidth: 4,
                fill: 'white'
            });
            group.add(circle);

            const background: Konva.Image = new Konva.Image({
                x: 0,
                y: 0,
                image: values[0],
                width: this._width,
                height: this._height
            });
            group.add(background);

            const scale = 0.7;
            const role: Konva.Image = new Konva.Image({
                x: (this._width - this._width * scale)/2,
                y: 0,
                image: values[1],
                width: this._width * scale,
                height: this._height * scale
            });
            group.add(role);
            const path: SvgCircleTextPath = new SvgCircleTextPath(this._width,35,50,this._role.name);

            const text: Konva.TextPath = new Konva.TextPath({
                x: 0,
                y: 0,
                fill: 'black',
                fontSize: 17,
                fontFamily: 'Dumbledore',
                text: this._role.name.toUpperCase(),
                align: 'center',
                data: path.path
            });
            group.add(text);

            // create text
            const pronounText = new Konva.Text({
                x: 0,
                y: 85,
                text: player.pronouns,
                fontSize: 10,
                fontFamily: 'Dumbledore',
                fill: 'black',
                align: 'center',
                name: 'roleTokenText'
            });
            pronounText.x(this._width/2-pronounText.getTextWidth()/2);
            group.add(pronounText);

            const nameText = new Konva.Text({
                x: 0,
                y: 70,
                text: player.name,
                fontSize: 16,
                fontFamily: 'Dumbledore',
                fontWeight: 800,
                fill: 'black',
                align: 'center',
                name: 'roleTokenText'
            });
            nameText.x(this._width/2-nameText.getTextWidth()/2);
            group.add(nameText);
        });

        group.on('dragmove', () => {
            const pos = group.absolutePosition();

            let x = this.clamp(pos.x,0,window.innerWidth-this._width);
            let y = this.clamp(pos.y,0,window.innerHeight-this._width);

            group.x(x);
            group.y(y);
        });

        const shroud: Shroud = new Shroud(50,50,{x: 75/2, y: 0});
        group.add(shroud.render());

        group.on('dblclick dbltap', () => {
            console.log(role.name);
        });

        return group;
    }

    public destroy(): void {
        this._group.destroy();
    }

    public intersects(other: Konva.Image): boolean {
        const currRect = this._group.getClientRect();
        const otherRect = other.getClientRect();

        return !(
            otherRect.x > currRect.x + currRect.width ||
            otherRect.x + otherRect.width < currRect.x ||
            otherRect.y > currRect.y + currRect.height ||
            otherRect.y + otherRect.height < currRect.y
        );
    }

    /**
     * Loads images
     * @param image
     * @private
     */
    protected loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            image.onload = () => { resolve(image); }
            image.onerror = (error) => { reject(error); }
        });
    }

    /**
     * Clamps value between a min and a max
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @private
     */
    protected clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}