import {Role} from "../Game/Role.ts";
import Konva from "konva";

export default class NightSheet {
    private readonly _roles: Set<Role>;
    private readonly _type: string;

    constructor(roles: Set<Role>, type: string) {
        this._roles = roles;
        this._type = type;
    }

    public get roles(): Set<Role> {
        return this._roles;
    }

    public get type(): string {
        return this._type;
    }

    public renderSheet(): Konva.Group {
        let width: number = 569;
        let height: number = 776;
        const group: Konva.Group = new Konva.Group({
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            id: this._type + '_nightsheet',
        });
        group.hide();

        let image = new Image();
        image.onload = function() {
            const bg = new Konva.Image({
                x: window.innerWidth-width,
                y: window.innerHeight-height,
                image: image,
                width: width,
                height: height
            });
            group.add(bg);
        }
        if (this._type === 'first') {
            image.src = '/img/sheets/night_order_first_background.webp';
        } else {
            image.src = '/img/sheets/night_order_other_background.webp';
        }

        let returnToGrimButton = new Image();
        returnToGrimButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: window.innerWidth - 162 - width - 20,
                y: height - 40,
                image: returnToGrimButton,
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            group.add(buttonImg);

            buttonImg.on('dblclick dbltap', (): void => {
                group.hide();
            });
        }
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        return group;
    }
}