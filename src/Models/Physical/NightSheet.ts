import {Role} from "../Game/Role.ts";
import Konva from "konva";
import {NightOrder} from "../Game/NightOrder.ts";

export default class NightSheet {
    private readonly _roles: Set<Role>;
    private readonly _type: string;
    private readonly _items: NightOrder[];

    constructor(roles: Set<Role>, type: string) {
        this._roles = roles;
        this._type = type;
        this._items = [];

        roles.forEach((role: Role) => {
            if (type === 'first') {
                role.firstNightOrder?.forEach( (order: NightOrder): void => {
                   this._items.push(order);
                });
            } else {
                role.otherNightOrder?.forEach( (order: NightOrder): void => {
                    this._items.push(order);
                });
            }
        });

        this._items.sort((a: NightOrder,b: NightOrder) => a.index - b.index);
    }

    public get roles(): Set<Role> {
        return this._roles;
    }

    public get type(): string {
        return this._type;
    }

    public renderSheet(): Konva.Group {
        const group: Konva.Group = new Konva.Group({
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            id: this._type + '_nightsheet',
            visible: false
        });

        let image = new Image();
        if (this._type === 'first') {
            image.src = '/img/sheets/night_order_first_background.webp';
        } else {
            image.src = '/img/sheets/night_order_other_background.webp';
        }

        let returnToGrimButton = new Image();
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        let images: Array<Promise<HTMLImageElement>> = new Array<Promise<HTMLImageElement>>();
        images.push(this.loadImage(image));
        images.push(this.loadImage(returnToGrimButton));

        this._items.forEach( (order: NightOrder) => {
           if (order.png !== undefined || order.png !== '') {
               let image = new Image();
               image.src = order.png;
               images.push(this.loadImage(image));
           }
        });

        Promise.all(images).then((values): void => {
            const ratio = values[0].naturalWidth / values[0].naturalHeight;
            group.x(window.innerWidth - window.innerHeight*ratio);
            const bg = new Konva.Image({
                x: 0,
                y: 0,
                image: values[0],
                width: window.innerHeight * ratio,
                height: window.innerHeight
            });
            const returnToGrimButton = new Konva.Image({
                x: -180,
                y: window.innerHeight-80,
                image: values[1],
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            group.add(bg, returnToGrimButton);

            returnToGrimButton.on('dblclick dbltap', (): void => {
                group.hide();
            });

            const group_text: Konva.Group = new Konva.Group({
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight,
                id: this._type + '_nightsheet-text',
                visible: true,
                draggable: true
            });

            let location = 10;
            for (let i: number = 2; i < values.length; i++) {
                let ratio: number = values[i].naturalWidth / values[i].naturalHeight;
                const role_bg = new Konva.Image({
                    x: 20,
                    y: location,
                    image: values[i],
                    width: bg.width(),
                    height: bg.width()/ratio
                });
                group_text.add(role_bg);

                location += bg.width()/ratio;
            }

            group_text.on('dragmove', () => {
                const pos = group_text.position();

                let currY = this.clamp(pos.y, -window.innerHeight, window.innerHeight);
                group_text.y(currY);
                group_text.x(0);
            });

            group.add(group_text);
        });

        return group;
    }

    protected loadImage(image: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            image.onload = () => { resolve(image); }
            image.onerror = (error) => { reject(error); }
        });
    }

    protected clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
