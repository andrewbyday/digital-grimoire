import Token from "../Physical/Token.ts";

export default class SvgCircleTextPath {
    private readonly _token: Token;                 // token, used for its position
    private readonly _innerRadius: number = 0;      // inner radius (top of text)
    private readonly _outerRadius: number = 0;      // outer radius (bottom of text)
    private _text: string = "";                     // text to be used
    private _path:string = "";                      // svg path

    constructor(token: Token, innerRadius: number, outerRadius: number, text: string) {
        this._token = token;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;
        this._text = text;
        this._path = this.generatePath(innerRadius, outerRadius);
    }

    /**
     * Get the inner radius (where the top of the text should touch)
     */
    public get innerRadius(): number {
        return this._innerRadius;
    }

    /**
     * Get the outer radius (where the bottom of the text should touch)
     */
    public get outerRadius(): number {
        return this._outerRadius;
    }

    /**
     * Get the text
     */
    public get text(): string {
        return this._text;
    }

    /**
     * Set the text
     * @param value
     */
    public set text(value: string) {
        this._text = value;
    }

    /**
     * Get path
     */
    public get path(): string {
        return this._path;
    }

    /**
     * Generates and returns the svg path for text around the token
     * @param innerRadius
     * @param outerRadius
     * @private
     */
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

    /**
     * Returns the x/y positions
     * @param radius
     * @param angleInDegrees
     * @private
     */
    private coordinateTransformation(radius: number, angleInDegrees: number): {x: number, y: number} {
        const position: {x: number, y: number } = this._token.boardPosition;
        const angleInRadians: number = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: position.x + (radius * Math.cos(angleInRadians)),
            y: position.y + (radius * Math.sin(angleInRadians))
        };
    }
}