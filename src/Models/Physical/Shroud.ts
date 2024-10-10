import Konva from "konva";

export default class Shroud {
    private _height: number;
    private _width: number;
    private _position: { x: number, y: number };
    private _connected: boolean;
    private readonly _group: Konva.Group;

    constructor(height: number, width: number, position: { x: number; y: number }) {
        this._height = height;
        this._width = width;
        this._connected = false;
        this._position = position;

        this._group = new Konva.Group({
            x: this._position.x,
            y: this._position.y,
            width: this._width,
            height: this._height,
            draggable: true
        });
    }

    public get connected(): boolean {
        return this._connected;
    }

    public set connected(value: boolean) {
        this._connected = value;
    }

    /**
     * Get height of the shroud in pixels
     */
    public get height(): number {
        return this._height;
    }

    /**
     * Set height of the shroud
     * @param {number} value pixels
     */
    public set height(value: number) {
        this._height = value;
    }

    /**
     * Get the width of the shroud in pixels
     */
    public get width(): number {
        return this._width;
    }

    /**
     * Set the width of the shroud
     * @param {number} value pixels
     */
    public set width(value: number) {
        this._width = value;
    }

    /**
     * Get the position of the shroud
     */
    public get position(): { x: number, y: number } {
        return this._position;
    }

    public get group(): Konva.Group {
        return this._group;
    }

    /**
     * Set the position of the shroud
     * @param {x: number, y: number} value x/y pixel coordinate on the Board
     */
    public set position(value: { x: number, y: number }) {
        this._position = value;
    }

    public render(): Konva.Group {
        const width: number = this._width;
        const height: number = this._height;

        const group: Konva.Group = this._group;

        let image = new Image();
        image.onload = function(): void {
            const scale: number = image.naturalWidth / image.naturalHeight;

            const k_img: Konva.Image = new Konva.Image({
                x: 0,
                y: 0,
                image: image,
                width: width,
                height: height/scale
            });

            group.add(k_img);
        }
        image.src = '/img/shroud/death_shroud.png';

        return group;
    }

    public intersects(other: Konva.Image | Konva.Group | Konva.Shape): boolean {
        const currRect = this._group.getClientRect();
        const otherRect = other.getClientRect();

        return !(
            otherRect.x > currRect.x + currRect.width ||
            otherRect.x + otherRect.width < currRect.x ||
            otherRect.y > currRect.y + currRect.height ||
            otherRect.y + otherRect.height < currRect.y
        );
    }

    public destroy(): void {
        this._group.destroy();
    }
}