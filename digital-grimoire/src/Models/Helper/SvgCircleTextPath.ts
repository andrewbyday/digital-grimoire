export default class SvgCircleTextPath {
    private readonly _innerRadius: number = 0;
    private readonly _outerRadius: number = 0;
    private _text: string = "";

    constructor(innerRadius: number, outerRadius: number, text: string) {
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;
        this._text = text;
    }

    public get innerRadius(): number {
        return this._innerRadius;
    }

    public get outerRadius(): number {
        return this._outerRadius;
    }

    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        this._text = value;
    }
}