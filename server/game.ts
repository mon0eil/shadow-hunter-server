import { spacesCards } from "./spaces-cards";
import { Space } from "./interface/space.model";
import { Pawn } from "./interface/pawn.model";
import { Card } from "./interface/card.model";
import { whiteCards } from "./white-cards";
import { blackCards } from "./black-cards";
import { greenCards } from "./green-cards";

const PAWN_COLROS = ['violet', 'black', 'yellow', 'blue', 'white', 'purple', 'green', 'orange', 'red'];

export class Game {
    connections: any[] = [];
    pawns: Pawn[] = [];
    spaces: Space[] = spacesCards.slice();

    whiteDeck: Card[] = whiteCards.slice();
    whiteCard: Card;
    whiteDiscard: Card[] = [];

    blackDeck: Card[] = blackCards.slice();
    blackCard: Card;
    blackDiscard: Card[] = [];

    greenDeck: Card[] = greenCards.slice();
    greenDiscard: Card[] = [];

    dices: any = {
        six: null,
        four: null
    }

    remainingPawnColors = PAWN_COLROS.slice();

    text = '';

    addPlayer(connection) {

        this.connections.push(connection);

        connection.on('message', message => {
            const json = JSON.parse(message);
            this.handleMessage(connection, json.type, json.data);
        });

        connection.on('close', () => {
            this.connections.splice(this.connections.findIndex(c => c === connection), 1);
            this.broadcastConnectedPlayerCount();
        })

        this.broadcastConnectedPlayerCount();
        this.broadcastPawns();
        this.broadcastSpaces();
        this.broadcastWhiteCard();
        this.broadcastBlackCard();
        this.broadcastDices();
        this.broadcastText();
    }

    reset() {
        this.pawns = [];
        this.whiteDeck = whiteCards.slice();
        this.whiteDiscard = [];
        this.blackDeck = blackCards.slice();
        this.blackDiscard = [];
        this.greenDeck = greenCards.slice();
        this.greenDiscard = [];
        this.broadcastPawns();
        this.broadcastConnectedPlayerCount();
        this.remainingPawnColors = PAWN_COLROS.slice();
        this.blackCard = null;
        this.whiteCard = null;
        this.broadcastBlackCard();
        this.broadcastWhiteCard();
    }

    handleMessage(connection, type, data) {
        console.log('got message', type);
        switch(type) {
            case 'create':
                this.addDices();
                break;
            case 'move':
                this.moveDice(data.id, data.x, data.y);
                break;
            case 'shuffle':
                this.shuffleSpace();
                break;
            case 'drawWhite':
                this.drawWhiteCard();
                break;
            case 'drawBlack':
                this.drawBlackCard();
                break;
            case 'drawGreen':
                this.drawGreenCard(connection);
                break;
            case 'throwDices':
                this.throwDices();
                break;
            case 'write':
                this.updateText(data);
                break;
            case 'reset':
                this.reset();
                break;
            default:
                connection.send(JSON.stringify({ type: 'error', data: 'No handler for action type : ' + type }));
                break;
        }
    }

    addDices() {
        let color = this.remainingPawnColors.pop();
        if (!color) {
            color = this.getRandomColor();
        }
        if (!this.pawns.find(dice => dice.color === color)) {
            this.pawns.push(
                {
                    x: 0.56 + this.randomNumber(-0.03, 0.03),
                    y: 0.5 + this.randomNumber(-0.03, 0.03),
                    color,
                    id: Math.random()
                },
                {
                    x: 0.21 + this.randomNumber(-0.04, 0.04),
                    y: 0.86 + this.randomNumber(-0.01, 0.01),
                    color,
                    id: Math.random()
                },
            );
        }
        this.broadcastPawns();
    }

    randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    moveDice(id: number, x: number, y: number) {
        const pawn = this.pawns.find(cd => cd.id === id);
        if (!pawn) return; 

        pawn.x = Math.min(Math.max(0, x), 1);
        pawn.y = Math.min(Math.max(0, y), 1);

        this.broadcastPawns();
    }

    shuffle(card: any[]){
        let i: number;
        let j: number;
        let x: any;
        let y: number;
        for (y = 0; y <= 3; y++) {
          for (i = 0; i < card.length; i++) {
            j = Math.floor(Math.random() * (i + 1));
            x = card[i];
            card[i] = card[j];
            card[j] = x;
          }
        }
        return card;
    }

    shuffleSpace() {
        this.spaces = this.shuffle(this.spaces);
        this.broadcastSpaces();
    }

    drawWhiteCard() {
        if (!this.whiteDeck) return; 

        this.whiteDeck = this.shuffle(this.whiteDeck);
        const card = this.whiteDeck.pop()!;
        this.whiteCard = card;
        this.whiteDiscard.push(card);
        this.broadcastWhiteCard();
    }

    drawBlackCard() {
        if (!this.blackDeck) return; 

        this.blackDeck = this.shuffle(this.blackDeck);
        const card = this.blackDeck.pop()!;
        this.blackCard = card;
        this.blackDiscard.push(card);
        this.broadcastBlackCard();
    }


    drawGreenCard(connection) {
        if (!this.greenDeck) return; 

        this.greenDeck = this.shuffle(this.greenDeck);
        const card = this.greenDeck.pop()!;
        this.greenDiscard.push(card)
        console.log(card)
        this.broadcastGreenCard(connection, card);
    }

    throwDices() {
        this.dices = {
            six: Math.floor(Math.random() * 6) + 1,
            four: Math.floor(Math.random() * 4) + 1
        }
        this.broadcastDices();
    }

    updateText(text: string) {
        console.log(text);
        this.text = text;
        this.broadcastText();
    }

    broadcast(type: string, data: any) {
        return this.connections.forEach(connection => {
            connection.send(JSON.stringify({ type, data }));
        });
    }

    broadcastPawns() {
        this.broadcast('pawns', this.pawns);
    }

    broadcastSpaces() {
        this.broadcast('spaces', this.spaces);
    }

    broadcastWhiteCard(){
        this.broadcast('white', this.whiteCard);
    }

    broadcastBlackCard(){
        this.broadcast('black', this.blackCard);
    }

    broadcastGreenCard(connection, card: Card){
        connection.send(JSON.stringify({ type:'green', data:card }));
    }

    broadcastConnectedPlayerCount() {
        this.broadcast('playerCount', this.connections.length);
    }

    broadcastDices() {
        this.broadcast('dices', this.dices)
    }

    broadcastText() {
        this.broadcast('text', this.text);
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
}