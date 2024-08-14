export default class SvgCircleTextPath {
    private readonly _tokenRadius: number = 0;
    private readonly _innerRadius: number = 0;      // inner radius (top of text)
    private readonly _outerRadius: number = 0;      // outer radius (bottom of text)
    private _text: string = "";                     // text to be used
    private _path:string = "";                      // svg path

    constructor(tokenRadius: number, innerRadius: number, outerRadius: number, text: string) {
        this._tokenRadius = tokenRadius;
        this._innerRadius = innerRadius;
        this._outerRadius = outerRadius;
        this._text = text;
        this._path = this.generatePath(tokenRadius, innerRadius, outerRadius);
    }

    public get tokenRadius(): number {
        return this._tokenRadius;
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
     * @param tokenRadius
     * @param innerRadius
     * @param outerRadius
     * @private
     */
    private generatePath(tokenRadius: number, innerRadius: number, outerRadius: number): string {
        const end: number = 360;
        const start: number = 1;
        const bisectPath: number = (innerRadius+outerRadius)/2;

        const textStart: {x: number, y: number} = this.coordinateTransformation(tokenRadius, bisectPath, end);
        const textEnd: {x: number, y: number} = this.coordinateTransformation(tokenRadius, bisectPath, start);

        return `M ${textStart.x} ${textStart.y} A ${bisectPath} ${bisectPath} 0 1 0 ${textEnd.x} ${textEnd.y} z`;
    }

    /**
     * Returns the x/y positions
     * @param tokenRadius
     * @param bisectPath
     * @param angleInDegrees
     * @private
     */
    private coordinateTransformation(tokenRadius: number, bisectPath: number, angleInDegrees: number): {x: number, y: number} {
        const angleInRadians: number = (angleInDegrees-90) * Math.PI / 180.0;
        const finalX: number = tokenRadius/2 + (bisectPath * Math.cos(angleInRadians));
        const finalY: number = tokenRadius/2 + (bisectPath * Math.sin(angleInRadians));

        return {
            x: finalX,
            y: finalY
        };
    }
}