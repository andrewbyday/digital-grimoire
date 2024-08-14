import {Role} from "../Game/Role.ts";
import Player from "../Game/Player.ts";
import Konva from "konva";
import SvgCircleTextPath from "../Helper/SvgCircleTextPath.ts";

export default class Token {
    private _role: Role;
    private _boardPosition: { x: number; y: number };
    private readonly _group: Konva.Group;
    private readonly _width: number;
    private readonly _height: number;

    constructor(role: Role, position: { x: number; y: number }, width: number = 125, height: number = 125) {
        this._role = role;
        this._boardPosition = position;
        this._group = this.createGroup(role,position);
        this._width = width;
        this._height = height;
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
     * @param position
     * @private
     */
    private createGroup(role: Role, position: { x: number; y: number }): Konva.Group {
        const group: Konva.Group = new Konva.Group({
            x: position.x,
            y: position.y,
            id: role.script_id,
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

            const scale = 0.75;
            const role: Konva.Image = new Konva.Image({
                x: (this._width - this._width * scale)/2,
                y: 0,
                image: values[1],
                width: this._width * scale,
                height: this._height * scale
            });
            group.add(role);

            const path: SvgCircleTextPath = new SvgCircleTextPath(125,35,50,this._role.name);
            console.log(path.path);
            const text: Konva.TextPath = new Konva.TextPath({
                x: 0,
                y: 0,
                fill: 'black',
                fontSize: 18,
                fontStyle: 'bold',
                fontFamily: 'Dumbledore',
                text: this._role.name.toUpperCase(),
                align: 'center',
                data: path.path
            });
            group.add(text);
        });

        group.on('dragmove', () => {
            const pos = group.absolutePosition();

            let x = this.clamp(pos.x,0,window.innerWidth-125);
            let y = this.clamp(pos.y,0,window.innerHeight-125);

            group.x(x);
            group.y(y);
        });

        group.on('dblclick dbltap', () => {
           console.log(role.name);
        });

        return group;
    }

    /**
     * Loads images
     * @param image
     * @private
     */
    private loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
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
    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}

export class PlayerToken extends Token {
    private readonly _player: Player;

    constructor(role: Role, player: Player, position: { x: number; y: number }) {
        super(role, position);

        this._player = player;
    }

    public get player(): Player {
        return this._player;
    }
}

export class FabledToken extends Token {
    constructor(role: Role, position: { x: number; y: number }) {
        super(role, position);
    }
}