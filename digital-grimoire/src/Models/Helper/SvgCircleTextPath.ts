import Token from "../Physical/Token.ts";

export default class SvgCircleTextPath {
    private readonly _token: Token;
    private readonly _innerRadius: number = 0;
    private readonly _outerRadius: number = 0;
    private _text: string = "";
    private _path:string = "";

    constructor(token: Token, innerRadius: number, outerRadius: number, text: string) {
        this._token = token;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;
        this._text = text;
        this._path = this.generatePath(innerRadius, outerRadius);
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

    public get path(): string {
        return this._path;
    }

    private generatePath(innerRadius: number, outerRadius: number): string {
        const end: number = 360;
        const start: number = 0;
        const radius: number = (innerRadius+outerRadius)/2;

        const textStart: {x: number, y: number} = this.coordinateTransformation(radius, end);
        const textEnd: {x: number, y: number} = this.coordinateTransformation(radius, start);

        const sweep: string = end - start <= 180 ? "0" : "1";

        return [
            "M", textStart.x, textStart.y,
            "A", radius, radius, 0, sweep, 0, textEnd.x, textEnd.y, "z"
        ].join(" ");
    }

    private coordinateTransformation(radius: number, angleInDegrees: number): {x: number, y: number} {
        const position: {x: number, y: number } = this._token.boardPosition;
        const angleInRadians: number = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: position.x + (radius * Math.cos(angleInRadians)),
            y: position.y + (radius * Math.sin(angleInRadians))
        };
    }
}