import {Role} from "../Game/Role.ts";
import Player from "../Game/Player.ts";
import Konva from "konva";
import SvgCircleTextPath from "../Helper/SvgCircleTextPath.ts";

export default class TokenReminder {
    protected _role: Role;
    protected _reminder: number;
    protected _boardPosition: { x: number; y: number };
    protected readonly _group: Konva.Group;
    protected readonly _width: number;
    protected readonly _height: number;

    constructor(role: Role, reminder: number, position: { x: number; y: number }, width: number = 75, height: number = 75) {
        this._role = role;
        this._reminder = reminder;
        this._boardPosition = position;
        this._group = this.createGroup(role,position);
        this._width = width;
        this._height = height;
    }

    public disableDragging(): void {
        this._group.draggable(false);
    }

    public enableDragging(): void {
        this._group.draggable(true);
    }

    /**
     * Returns role
     */
    public get role(): Role {
        return this._role;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
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

            const scale = 0.7;
            const role: Konva.Image = new Konva.Image({
                x: (this._width - this._width * scale)/2,
                y: 0,
                image: values[1],
                width: this._width * scale,
                height: this._height * scale
            });
            group.add(role);

            const path: SvgCircleTextPath = new SvgCircleTextPath(this._width,15,30,this._role.name);
            console.log(path.path);
            const text: Konva.TextPath = new Konva.TextPath({
                x: 0,
                y: 0,
                fill: 'black',
                fontSize: 17,
                fontStyle: 'bold',
                fontFamily: 'Dumbledore',
                text: this._role.reminders[this._reminder],
                align: 'center',
                data: path.path
            });
            group.add(text);
        });

        group.on('dragmove', () => {
            const pos = group.absolutePosition();

            let x = this.clamp(pos.x,0,window.innerWidth-this._width);
            let y = this.clamp(pos.y,0,window.innerHeight-this._width);
            group.x(x);
            group.y(y);
        });

        return group;
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