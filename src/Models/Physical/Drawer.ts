import Konva from "konva";

export default class Drawer {
    private readonly _group: Konva.Group;

    constructor() {
        this._group = new Konva.Group({
            x: 0,
            y: 0,
            width: 150,
            height: window.innerHeight,
            id: 'put-away-drawer',
            visible: false
        });

        const bg: Konva.Rect = new Konva.Rect({
            x: window.innerWidth-150,
            y: 0,
            fill: 'black',
            width: 150,
            height: window.innerHeight,
        });

        this._group.add(bg);
    }

    public get group(): Konva.Group {
        return this._group;
    }

    public render(): Konva.Group {
        let returnToGrimButton = new Image();
        returnToGrimButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: window.innerWidth - 390,
                y: window.innerHeight - 80,
                image: returnToGrimButton,
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            this._group.add(buttonImg);
        }
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        return this._group;
    }
}