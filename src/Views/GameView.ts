import Board from "../Models/Physical/Board.ts";
import Konva from "konva";
import {Stage} from "konva/lib/Stage";
import {Socket} from "socket.io-client";
import TokenPlayer from "../Models/Physical/TokenPlayer.ts";
import Token from "../Models/Physical/Token.ts";

export default class GameView {
    private readonly _stage: Stage;
    private readonly _socket: Socket;
    private readonly _tokenLayer: Konva.Layer;
    private readonly _drawerLayer: Konva.Layer;
    private readonly _buttonsLayer: Konva.Layer;

    constructor(stage: Stage, socket: Socket) {
        this._stage = stage;
        this._socket = socket;

        this._tokenLayer = new Konva.Layer();
        this._drawerLayer = new Konva.Layer();
        this._buttonsLayer = new Konva.Layer();

        this._stage.add(this._tokenLayer);
        this._stage.add(this._drawerLayer);
        this._stage.add(this._buttonsLayer);
    }

    public static async init(board: Board, socket: Socket): Promise<GameView> {
        const stage: Stage = new Konva.Stage({
            container: 'app',
            width: board.width,
            height: board.height,
        });

        return new GameView(stage, socket);
    }

    public get stage(): Stage {
        return this._stage;
    }

    public get socket(): Socket {
        return this._socket;
    }

    public renderTokens(tokens: Set<Token>): void {
        tokens.forEach((token: Token) => {
            this._tokenLayer.add(token.group);
        });
    }

    public renderButtons(): void {
        const width: number = this._stage.width();
        const height: number = this._stage.height();

        const group: Konva.Group = new Konva.Group({
            x: 0,
            y: 0,
            width: width,
            height: height,
            name: 'buttons',
            draggable: false
        });

        let firstNightButton = new Image();
        firstNightButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: width-125,
                y: height-257,
                image: firstNightButton,
                width: 100,
                height: 257,
                name: 'first-night-button'
            });
            group.add(buttonImg);
        }
        firstNightButton.src = '/img/buttons/first_night.png';

        let otherNightbutton = new Image();
        otherNightbutton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: width-64.25,
                y: height-257,
                image: otherNightbutton,
                width: 64.25,
                height: 257,
                name: 'other-night-button'
            });
            group.add(buttonImg);
        }
        otherNightbutton.src = '/img/buttons/other_night.png';

        let additionalTokensButton = new Image();
        additionalTokensButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: width-140,
                y: height-(257+175),
                image: additionalTokensButton,
                width: 162.86,
                height: 150,
                name: 'additional-tokens-button'
            });
            group.add(buttonImg);
        }
        additionalTokensButton.src = '/img/buttons/additional_tokens.png';

        let nightActionCardsButton = new Image();
        nightActionCardsButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: width-140,
                y: height-(257+175+175),
                image: nightActionCardsButton,
                width: 160.43,
                height: 150,
                name: 'night-action-cards-button'
            });
            group.add(buttonImg);
        }
        nightActionCardsButton.src = '/img/buttons/night_action_cards.png';

        let putAwayButton = new Image();
        putAwayButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: width-140,
                y: height-(257+175+175+200),
                image: putAwayButton,
                width: 175,
                height: 175,
                name: 'put-away-button'
            });
            group.add(buttonImg);
        }
        putAwayButton.src = '/img/buttons/put_away.png';


        this._buttonsLayer.add(group);
    }

    public renderDrawer(): void {
        const finalWidth: number = 200;
        const finalHeight: number = 1000;

        const group: Konva.Group = new Konva.Group({
            x: this._stage.width() - finalWidth,
            y: 0,
            name: 'drawer',
            draggable: true
        });

        const bg: Konva.Rect = new Konva.Rect( {
            x: 0,
            y: 0,
            width: finalWidth,
            height: finalHeight,
            fill: 'black'
        });

        const characterRolesBtn: Konva.Text = new Konva.Text({
            x: 170,
            y: 120,
            text: 'SCRIPT',
            fontSize: 28,
            fontFamily: 'Dumbledore',
            fill: 'white',
            rotation: 270,
            id: 'characterRolesTextBtn',
            opacity: 1,
        });

        characterRolesBtn.on('click tap', (): void => {
            characterRolesBtn.fill('white');
            travelerRolesBtn.fill('grey');
            fabledRolesBtn.fill('grey');
        });

        const travelerRolesBtn: Konva.Text = new Konva.Text({
            x: 170,
            y: 300,
            text: 'TRAVELERS',
            fontSize: 28,
            fontFamily: 'Dumbledore',
            fill: 'grey',
            rotation: 270,
            id: 'travelerRolesTextBtn',
        });

        travelerRolesBtn.on('click tap', (): void => {
            characterRolesBtn.fill('grey');
            travelerRolesBtn.fill('white');
            fabledRolesBtn.fill('grey');
        });

        const fabledRolesBtn: Konva.Text = new Konva.Text({
            x: 170,
            y: 420,
            text: 'FABLED',
            fontSize: 28,
            fontFamily: 'Dumbledore',
            fill: 'grey',
            rotation: 270,
            id: 'fabledRolesTextBtn',
        });

        fabledRolesBtn.on('click tap', (): void => {
            characterRolesBtn.fill('grey');
            travelerRolesBtn.fill('grey');
            fabledRolesBtn.fill('white');
        });

        group.add(bg, characterRolesBtn, fabledRolesBtn, travelerRolesBtn);

        this._drawerLayer.add(group);
    }

    public hideDrawer(): void {
        this._drawerLayer.hide();
    }

    public showDrawer(): void {
        this._drawerLayer.show();
    }

    public listenJoins(token: TokenPlayer): void {
        this._tokenLayer.add(token.group);
    }
}