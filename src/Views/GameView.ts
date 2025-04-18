import Board from "../Models/Physical/Board.ts";
import Konva from "konva";
import {Stage} from "konva/lib/Stage";
import {Socket} from "socket.io-client";
import TokenPlayer from "../Models/Physical/TokenPlayer.ts";
import TokenReminder from "../Models/Physical/TokenReminder.ts";
import Token from "../Models/Physical/Token.ts";
import NightSheet from "../Models/Physical/NightSheet.ts";
import {Role} from "../Models/Game/Role.ts";
import Drawer from "../Models/Physical/Drawer.ts";
import Shroud from "../Models/Physical/Shroud.ts";
import {Modal} from "bootstrap";
import Player from "../Models/Game/Player.ts";

export default class GameView {
    private readonly _stage: Stage;
    private readonly _socket: Socket;
    private readonly _tokenLayer: Konva.Layer;
    private readonly _tokenReminderLayer: Konva.Layer;
    private readonly _shroudLayer: Konva.Layer;
    private readonly _drawerLayer: Konva.Layer;
    private readonly _putAwayDrawerLayer: Konva.Layer;
    private readonly _buttonsLayer: Konva.Layer;
    private readonly _nightActionsLayer: Konva.Layer;
    private readonly _sheetsLayer: Konva.Layer;

    private _tokensPutAway: number;

    constructor(stage: Stage, socket: Socket) {
        this._stage = stage;
        this._socket = socket;

        Konva.showWarnings = false;

        this._buttonsLayer = new Konva.Layer();
        this._tokenLayer = new Konva.Layer();
        this._tokenReminderLayer = new Konva.Layer();
        this._shroudLayer = new Konva.Layer();
        this._putAwayDrawerLayer = new Konva.Layer();
        this._drawerLayer = new Konva.Layer();
        this._nightActionsLayer = new Konva.Layer();
        this._sheetsLayer = new Konva.Layer();

        this._stage.add(this._buttonsLayer);
        this._stage.add(this._tokenLayer);
        this._stage.add(this._tokenReminderLayer);
        this._stage.add(this._shroudLayer);
        this._stage.add(this._putAwayDrawerLayer);
        this._stage.add(this._drawerLayer);
        this._stage.add(this._nightActionsLayer);
        this._stage.add(this._sheetsLayer);

        this._tokensPutAway = 0;
    }

    public static async init(board: Board, socket: Socket): Promise<GameView> {
        const stage: Stage = new Konva.Stage({
            container: 'app',
            width: board.width,
            height: board.height,
        });

        const bg_layer: Konva.Layer = new Konva.Layer();
        stage.add(bg_layer);

        const bg_group: Konva.Group = new Konva.Group({
            x: 0,
            y: 0,
            width: board.width,
            height: board.height,
            name: 'background-group',
            draggable: false
        });
        bg_layer.add(bg_group);

        let bg = new Image();
        bg.onload = function() {
            const aspectRatio: number = stage.width() / stage.height();
            const imageRatio: number = bg.naturalWidth / bg.naturalHeight;

            let finalWidth: number;
            let finalHeight: number;

            if (aspectRatio >= imageRatio) {
                finalWidth = bg.naturalWidth;
                finalHeight = bg.naturalWidth / aspectRatio;
            } else {
                finalWidth = bg.naturalHeight * aspectRatio;
                finalHeight = bg.naturalHeight;
            }

            if (finalWidth < stage.width()) {
                finalWidth = stage.width();
                finalHeight = stage.width() / aspectRatio;
            }

            const img = new Konva.Image({
                x: 0,
                y: 0,
                image: bg,
                width: finalWidth,
                height: finalHeight,
                name: 'background'
            });
            bg_group.add(img);
        }
        bg.src = '/img/felt_background.webp';

        return new GameView(stage, socket);
    }

    public get tokensPutAway(): number {
        return this._tokensPutAway;
    }

    public set tokensPutAway(val: number) {
        this._tokensPutAway = val;
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
        firstNightButton.src = '/img/buttons/first_night.png';

        let otherNightbutton = new Image();
        otherNightbutton.src = '/img/buttons/other_night.png';

        let additionalTokensButton = new Image();
        additionalTokensButton.src = '/img/buttons/additional_tokens.png';

        let nightActionCardsButton = new Image();
        nightActionCardsButton.src = '/img/buttons/night_action_cards.png';

        let putAwayButton = new Image();
        putAwayButton.src = '/img/buttons/put_away.png';

        Promise.all([this.loadImage(firstNightButton),
                            this.loadImage(otherNightbutton),
                            this.loadImage(additionalTokensButton),
                            this.loadImage(nightActionCardsButton),
                            this.loadImage(putAwayButton)]).then(
            (values): void => {
                const firstNightButton: Konva.Image = new Konva.Image({
                    x: width-125,
                    y: height-257,
                    image: values[0],
                    width: 100,
                    height: 257,
                    name: 'first-night-button'
                });

                firstNightButton.on('dblclick dbltap', () => {
                   this.showFirstNight();
                });

                const otherNightButton: Konva.Image = new Konva.Image({
                    x: width-64.25,
                    y: height-257,
                    image: values[1],
                    width: 64.25,
                    height: 257,
                    name: 'other-night-button'
                });

                otherNightButton.on('dblclick dbltap', () => {
                    this.showOtherNight();
                });

                const additionalTokensButton: Konva.Image = new Konva.Image({
                    x: width-140,
                    y: height-(257+175),
                    image: values[2],
                    width: 162.86,
                    height: 150,
                    name: 'additional-tokens-button'
                });

                const nightActionCardsButton: Konva.Image = new Konva.Image({
                    x: width-140,
                    y: height-(257+175+175),
                    image: values[3],
                    width: 160.43,
                    height: 150,
                    name: 'night-action-cards-button'
                });

                const putAwayButton: Konva.Image = new Konva.Image({
                    x: width-140,
                    y: height-(257+175+175+200),
                    image: values[4],
                    width: 175,
                    height: 175,
                    name: 'put-away-button',
                    id: 'put-away-button'
                });

                putAwayButton.on('dblclick dbltap', () => {
                    let group = this._putAwayDrawerLayer.findOne('#put-away-drawer');
                    if (group !== undefined) {
                        group.show();
                    }
                });

                this._putAwayDrawerLayer.on('dblclick dbltap', (e) => {
                    let group = this._putAwayDrawerLayer.findOne('#put-away-drawer');
                    if (e.target.name() === 'return-to-grim-button' && group !== undefined) {
                        group.hide();
                    }
                });

                additionalTokensButton.on('dblclick dbltap', () => {
                    this._buttonsLayer.hide();
                    this._drawerLayer.show();
                });

                nightActionCardsButton.on('dblclick dbltap', () => {
                    this._nightActionsLayer.show();
                    this._tokenLayer.hide();
                    this._tokenReminderLayer.hide();
                    this._buttonsLayer.hide();
                });

                group.add(firstNightButton, otherNightButton, additionalTokensButton, nightActionCardsButton, putAwayButton);
            }
        )

        this._buttonsLayer.add(group);
    }

    public renderDrawer(scriptTokens: Set<Token>, travellerTokens: Set<Token>, fabledTokens: Set<Token>): void {
        const finalWidth: number = 200;
        const finalHeight: number = 135 * scriptTokens.size + 30;
        const maxHeight: number = finalHeight - this._stage.height();
        const bottom: number = this._stage.height() - 400;

        const group: Konva.Group = new Konva.Group({
            x: this._stage.width() - finalWidth,
            y: 0,
            name: 'drawer',
            draggable: true
        });

        const picker: Konva.Group = new Konva.Group({
            x: this._stage.width() - finalWidth,
            y: 0,
            name: 'picker'
        });

        group.on('dragmove', () => {
            const pos = group.absolutePosition();

            let currY = this.clamp(pos.y, -maxHeight, 0);
            group.y(currY);
            group.x(this._stage.width()-finalWidth);
        });

        const scriptTokensGroup: Konva.Group = new Konva.Group({
            x: 0,
            y: 0
        });

        const travellerTokensGroup: Konva.Group = new Konva.Group({
            x: 0,
            y: 0
        });
        travellerTokensGroup.hide();

        const fabledTokensGroup: Konva.Group = new Konva.Group({
            x: 0,
            y: 0
        });
        fabledTokensGroup.hide();

        scriptTokens.forEach( (token: Token) => {
            token.disableDragging();

            token.group.on('dblclick dbltap', (): void => {
                const newToken: Token = new Token(token.role, {x: 50, y: bottom});
                newToken.group.on('dragend', (): void => {
                    const putaway: Konva.Image | undefined = this._buttonsLayer.findOne('#put-away-button');
                    if (putaway !== undefined) {
                        if (newToken.intersects(putaway)) {
                            newToken.group.moveTo(this._putAwayDrawerLayer.findOne('#put-away-drawer'));
                            newToken.group.x(this._stage.width() - newToken.width - 10);
                            newToken.group.y(10 + ((newToken.height+10)*this._tokensPutAway));
                            newToken.group.draggable(false);
                            this._tokensPutAway++;
                        }
                    }
                });
                this._tokenLayer.add(newToken.group);

                if (token.role.reminders !== undefined) {
                    for (let i: number = 0; i < token.role.reminders.length; i++) {
                        const newToken: TokenReminder = new TokenReminder(token.role, i, {x: 50, y: bottom+200});
                        newToken.group.on('dragend', (): void => {
                            const putaway: Konva.Image | undefined = this._buttonsLayer.findOne('#put-away-button');
                            if (putaway !== undefined) {
                                if (newToken.intersects(putaway)) {
                                    newToken.destroy();
                                }
                            }
                        });
                        this._tokenReminderLayer.add(newToken.group);
                    }
                }

                const shroud: Shroud = new Shroud(50, 50, {x: 50, y: this._stage.height()-100});
                this._shroudLayer.add(shroud.render());
            });

            scriptTokensGroup.add(token.group);
        });

        travellerTokens.forEach( (token: Token) => {
            token.disableDragging();

            token.group.on('dblclick dbltap', (): void => {
                const newToken: Token = new Token(token.role, {x: 50, y: bottom});
                newToken.group.on('dragend', (): void => {
                    const putaway: Konva.Image | undefined = this._buttonsLayer.findOne('#put-away-button');
                    if (putaway !== undefined) {
                        if (newToken.intersects(putaway)) {
                            newToken.destroy();
                        }
                    }
                });
                this._tokenLayer.add(newToken.group);

                const shroud: Shroud = new Shroud(50, 50, {x: 50, y: this._stage.height()-100});
                this._shroudLayer.add(shroud.render());
            });

            travellerTokensGroup.add(token.group);
        });

        fabledTokens.forEach( (token: Token) => {
            token.disableDragging();

            token.group.on('dblclick dbltap', (): void => {
                const newToken: Token = new Token(token.role, {x: 50, y: bottom});
                newToken.group.on('dragend', (): void => {
                    const putaway: Konva.Image | undefined = this._buttonsLayer.findOne('#put-away-button');
                    if (putaway !== undefined) {
                        if (newToken.intersects(putaway)) {
                            newToken.destroy();
                        }
                    }
                });
                this._tokenLayer.add(newToken.group);
            });

            fabledTokensGroup.add(token.group);
        });

        const returnToGrimGroup: Konva.Group = new Konva.Group({
            x: 0,
            y: 0,
            width: this._stage.width(),
            height: this._stage.height(),
            name: 'return-to-grimoire-group',
            draggable: false
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

            scriptTokensGroup.show();
            travellerTokensGroup.hide();
            fabledTokensGroup.hide();
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

            scriptTokensGroup.hide();
            travellerTokensGroup.show();
            fabledTokensGroup.hide();
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

            scriptTokensGroup.hide();
            travellerTokensGroup.hide();
            fabledTokensGroup.show();
        });

        let returnToGrimButton = new Image();
        returnToGrimButton.onload = (): void => {
            const buttonImg = new Konva.Image({
                x: this._stage.width() - 390,
                y: this._stage.height() - 80,
                image: returnToGrimButton,
                width: 162,
                height: 40,
                name: 'return-to-grim-button'
            });
            returnToGrimGroup.add(buttonImg);

            buttonImg.on('dblclick dbltap', (): void => {
                this._drawerLayer.hide();
                this._buttonsLayer.show();
            });

            this._drawerLayer.add(returnToGrimGroup);
        }
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        picker.add(characterRolesBtn, fabledRolesBtn, travelerRolesBtn);
        group.add(bg, scriptTokensGroup, travellerTokensGroup, fabledTokensGroup);

        this._drawerLayer.add(group);
        this._drawerLayer.add(picker);
    }

    public renderPutAwayDrawer(): void {
        const drawer: Drawer = new Drawer();

        this._putAwayDrawerLayer.on('dblclick dbltap', (e): void => {
            const target = e.target.parent;
            if (target?.name() === 'token') {
                target.moveTo(this._tokenLayer);
                target.x(25);
                target.y(25);
                target.draggable(true);
                this._tokensPutAway--;
            }
        });

        this._putAwayDrawerLayer.add(drawer.render());
    }

    public renderNightActionCards(): void {
        const size: number = 125;
        const bottom: number = this._stage.height();

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

        const rightAbilities = [
            "st_card_you",
            "st_card_player",
            "st_card_selected",
            "st_card_ability",
            "st_card_choice"
        ];

        for (let i: number = 0; i < leftAbilities.length; i++) {
            const file = leftAbilities[i];
            Konva.Image.fromURL('/img/cards/' + file + '.png', function (card) {
                card.setAttrs({
                    x: 180,
                    y: bottom - size - ((size+10)*i) - 10,
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

        for (let i: number = 0; i < rightAbilities.length; i++) {
            const file = rightAbilities[i];
            const stage: Konva.Stage = this._stage;
            Konva.Image.fromURL('/img/cards/' + file + '.png', function (card) {
                card.setAttrs({
                    x: stage.width()-180,
                    y: bottom - ((size+10)*i) - 10,
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

        var imageObj = new Image();
        imageObj.onload = function () {
            let finalWidth = 480;
            let finalHeight = finalWidth / (imageObj.naturalWidth / imageObj.naturalHeight);

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
                this._tokenLayer.show();
                this._tokenReminderLayer.show();
            });
        }
        returnToGrimButton.src = '/img/buttons/return_to_grim.png';

        this._nightActionsLayer.hide();
        this._tokenLayer.show();
        this._nightActionsLayer.add(group);
    }

    public renderNightSheet(roles: Set<Role>) {
        const firstNightSheet: NightSheet = new NightSheet(roles, 'first');
        const otherNightSheet: NightSheet = new NightSheet(roles, 'other');
        this._sheetsLayer.add(
            firstNightSheet.renderSheet(),
            otherNightSheet.renderSheet()
        );
    }

    public renderPlayerTokenRoleOptions(roles: Set<Role>): void {
        const rolesInput = document.getElementById('userRoleSelectInput') as HTMLSelectElement;

        roles.forEach( (role) => {
            rolesInput.add(new Option(role.name, role.script_id));
        });
    }

    public hideDrawer(): void {
        this._drawerLayer.hide();
    }

    public showDrawer(): void {
        this._drawerLayer.show();
    }

    public showFirstNight(): void {
        this._sheetsLayer.findOne('#first_nightsheet')?.show();
    }

    public hideFirstNight(): void {
        this._sheetsLayer.findOne('#first_nightsheet')?.hide();
    }

    public showOtherNight(): void {
        this._sheetsLayer.findOne('#other_nightsheet')?.show();
    }

    public hideOtherNight(): void {
        this._sheetsLayer.findOne('#other_nightsheet')?.hide();
    }

    public listenJoins(token: TokenPlayer): void {
        const putaway: Konva.Image | undefined = this._buttonsLayer.findOne('#put-away-button');

        token.group.on('dragend', (): void => {
            if (putaway !== undefined) {
                if (token.intersects(putaway)) {
                    token.group.moveTo(this._putAwayDrawerLayer.findOne('#put-away-drawer'));
                    token.group.x(this._stage.width() - token.width - 10);
                    token.group.y(10 + ((token.height+10)*this._tokensPutAway));
                    token.group.draggable(false);
                    this._tokensPutAway++;
                }
            }
        });

        this._tokenLayer.add(token.group);

        const shroud: Shroud = new Shroud(50, 50, {x: 50, y: this._stage.height()-100});
        this._shroudLayer.add(shroud.render());

        if (token.role.reminders !== undefined) {
            for (let i: number = 0; i < token.role.reminders.length; i++) {
                const newToken: TokenReminder = new TokenReminder(token.role, i, {x: 50, y: 50});
                newToken.group.on('dragend', (): void => {
                    if (putaway !== undefined) {
                        if (newToken.intersects(putaway)) {
                            newToken.destroy();
                        }
                    }
                });
                this._tokenReminderLayer.add(newToken.group);
            }
        }
    }

    public createListeners(roles: Set<Role>): void {
        this._shroudLayer.on('dragend', (e) => {
            const pos = e.target.getAbsolutePosition();
            const token = this._tokenLayer?.getIntersection(pos);
            const name = token?.parent?.name();

            if (token !== undefined && token !== null && name === 'token') {
                e.target.moveTo(token.parent);
                e.target.x(75/2);
                e.target.y(-5);
            }
        });

        this._tokenLayer.on('dragend', (e) => {
            if (e.target.name() === 'shroud') {
                const pos = e.target.getAbsolutePosition();
                e.target.moveTo(this._shroudLayer);
                e.target.x(pos.x);
                e.target.y(pos.y);
            }
        });

        this._tokenLayer.on('dbltap dblclick', (e) => {
            if (e.target?.parent?.name() === 'token') {
                const element = document.getElementById('playerTokenModal') as HTMLElement;

                const username = document.getElementById('usernameInput') as HTMLInputElement;
                const pronouns = document.getElementById('userPronounsInput') as HTMLInputElement;
                const uuid = document.getElementById('userUUIDInput') as HTMLInputElement;

                username.value = e.target.parent?.getAttr('player_name');
                pronouns.value = e.target.parent?.getAttr('player_pronouns');
                uuid.value = e.target.parent?.getAttr('player_uuid');

                const modal = new Modal(element);
                modal.show();

                document.getElementById('savePlayerTokenInfoButton')?.addEventListener('click', (): void => {
                    const playerRoleSelected = document.getElementById('userRoleSelectInput') as HTMLSelectElement;
                    const selectedRoleValue = playerRoleSelected.value;
                    const selectedRole = Array.from(roles).find((role) => role.script_id === selectedRoleValue);

                    if (selectedRole) {
                        const x: number | undefined = e.target?.parent?.x();
                        const y: number | undefined = e.target?.parent?.y();
                        const player = new Player(username.value, pronouns.value, false, uuid.value);

                        if (x && y) {
                            const newToken = new TokenPlayer(selectedRole, player, {x: x, y: y});
                            this._tokenLayer.add(newToken.group);
                        }

                        e.target?.parent?.destroy();
                    }
                });
            }
        });
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
