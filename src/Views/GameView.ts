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
    private readonly _settingsLayer: Konva.Layer;
    private readonly _nightActionsLayer: Konva.Layer;

    constructor(stage: Stage, socket: Socket) {
        this._stage = stage;
        this._socket = socket;

        this._tokenLayer = new Konva.Layer();
        this._drawerLayer = new Konva.Layer();
        this._buttonsLayer = new Konva.Layer();
        this._settingsLayer = new Konva.Layer();
        this._nightActionsLayer = new Konva.Layer();

        this._stage.add(this._tokenLayer);
        this._stage.add(this._drawerLayer);
        this._stage.add(this._buttonsLayer);
        this._stage.add(this._settingsLayer);
        this._stage.add(this._nightActionsLayer);
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

    public renderSettings(): void {
        const width: number = this._stage.width();
        const height: number = this._stage.height();

        const group: Konva.Group = new Konva.Group({
            x: 0,
            y: 0,
            width: width,
            height: height,
            name: 'settings-buttons',
            draggable: false
        });

        let returnToGrimButton = new Image();
        returnToGrimButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: width-390,
                y: height-80,
                image: returnToGrimButton,
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            group.add(buttonImg);

            buttonImg.on('dblclick dbltap', (): void => {
                this._settingsLayer.hide();
                this._drawerLayer.hide();
                this._buttonsLayer.show();
            });
        }
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        this._settingsLayer.add(group);
        this._settingsLayer.hide();
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

            buttonImg.on('dblclick dbltap', () => {
                this._buttonsLayer.hide();
                this._settingsLayer.show();
                this._drawerLayer.show();
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

            buttonImg.on('dblclick dbltap', () => {
               this._nightActionsLayer.show();
               this._buttonsLayer.hide();
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

    public renderNightActionCards(): void {
        const tokenSize: number = 125;
        const group = new Konva.Group({
            x: 0,
            y: 0,
            width: this._stage.width(),
            height: this._stage.height(),
            id: 'stCardLayer',
        });

        const leftAbilities = [
            "st_card_demon",
            "st_card_minions",
            "st_card_bluffs",
            "st_card_nominate",
            "st_card_vote"
        ];

        const leftAbilitiesPos = [
            50,
            135+50,
            300+50,
            460+50,
            600+50
        ];

        const rightAbilities = [
            "st_card_you",
            "st_card_player",
            "st_card_selected",
            "st_card_ability",
            "st_card_choice"
        ];

        const rightAbilitiesPos = [
            50+tokenSize,
            135+50+tokenSize,
            300+50+tokenSize,
            460+50+tokenSize,
            600+50+tokenSize
        ]

        for (let i = 0; i < leftAbilities.length; i++) {
            const file = leftAbilities[i];
            Konva.Image.fromURL('/img/cards/' + file + '.png', function (card) {
                card.setAttrs({
                    x: 180,
                    y: leftAbilitiesPos[i],
                    width: 125,
                    height: 180,
                    rotation: 90,
                    id: file,
                });
                card.on('dblclick dbltap', function() {
                    const currentCardDisplayed = group.findOne('#currentSTCard');
                    var imageObj = new Image();
                    imageObj.onload = function() {
                        if (currentCardDisplayed !== undefined) {
                            currentCardDisplayed.setAttr('image',imageObj);
                        }
                    };
                    imageObj.src = '/img/cards/' + file + '.png';
                });
                group.add(card);
            });
        }

        for (let i = 0; i < rightAbilities.length; i++) {
            const file = rightAbilities[i];
            Konva.Image.fromURL('/img/cards/' + file + '.png', function (card) {
                card.setAttrs({
                    x: window.innerWidth-180,
                    y: rightAbilitiesPos[i],
                    width: 125,
                    height: 180,
                    rotation: 270,
                    id: rightAbilities[i]
                });
                card.on('dblclick dbltap', function() {
                    const currentCardDisplayed = group.findOne('#currentSTCard');
                    var imageObj = new Image();
                    imageObj.onload = function() {
                        if (currentCardDisplayed !== undefined) {
                            currentCardDisplayed.setAttr('image',imageObj);
                        }
                    };
                    imageObj.src = '/img/cards/' + file + '.png';
                });
                group.add(card);
            });
        }

        let finalWidth = 480;
        let finalHeight = 692;
        var imageObj = new Image();
        imageObj.onload = function () {
            var button = new Konva.Image({
                x: window.innerWidth/2-finalWidth/2,
                y: window.innerHeight-finalHeight,
                width: finalWidth,
                height: finalHeight,
                id: 'currentSTCard',
                image: imageObj
            });

            // add the shape to the layer
            group.add(button);
        };
        imageObj.src = '/img/cards/st_card_demon.png';

        let returnToGrimButton = new Image();
        returnToGrimButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: (this._stage.width() - 162)/2,
                y: 30,
                image: returnToGrimButton,
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            group.add(buttonImg);

            buttonImg.on('dblclick dbltap', (): void => {
                this._nightActionsLayer.hide();
                this._buttonsLayer.show();
            });
        }
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        this._nightActionsLayer.hide();
        this._nightActionsLayer.add(group);
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