import { spacesCards } from "./spaces-cards";
import { Space } from "../interface/space.model";
import { Pawn } from "../interface/pawn.model";
import { Card } from "../interface/card.model";
import { whiteCards } from "./white-cards";
import { blackCards } from "./black-cards";
import { greenCards } from "./green-cards";

export class Game {
    connections = [];
    pawns: Pawn[] = [];
    spaces: Space[] = spacesCards.slice();

    whiteDeck: Card[] = whiteCards.slice();
    whiteDiscard: Card[] = [];

    blackDeck: Card[] = blackCards.slice();
    blackDiscard: Card[] = [];

    greenDeck: Card[] = greenCards.slice();
    greenDiscard: Card[] = [];

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
    }

    handleMessage(connection, type, data) {
        switch(type) {
            case 'create':
                this.addDices(data);
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
            case 'reset':
                this.reset();
                break;
            default:
                connection.send(JSON.stringify({ type: 'error', data: 'No handler for action type : ' + type }));
                break;
        }
    }

    addDices(color: string) {
        if (!this.pawns.find(dice => dice.color === color)) {
            this.pawns.push(
                {
                    x: 300 + Math.floor((Math.random() * 20) - 40),
                    y: 0 + Math.floor((Math.random() * 20) - 40),
                    color,
                    id: Math.random()
                },
                {
                    x: 750 + Math.floor((Math.random() * 20) - 40),
                    y: -300 + Math.floor((Math.random() * 20) - 40),
                    color,
                    id: Math.random()
                },
            );
        }
        this.broadcastPawns();
    }

    moveDice(id: number, x: number, y: number) {
        const pawn = this.pawns.find(cd => cd.id === id);
        if (!pawn) return; 

        pawn.x = x;
        pawn.y = y;

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
        const card = this.whiteDeck.pop()
        this.whiteDiscard.push(card)
        this.broadcastWhiteCard(card);
    }

    drawBlackCard() {
        if (!this.blackDeck) return; 

        this.blackDeck = this.shuffle(this.blackDeck);
        const card = this.blackDeck.pop()
        this.blackDiscard.push(card)
        this.broadcastBlackCard(card);
    }


    drawGreenCard(connection) {
        if (!this.greenDeck) return; 

        this.greenDeck = this.shuffle(this.greenDeck);
        const card = this.greenDeck.pop()
        this.greenDiscard.push(card)
        console.log(card)
        this.broadcastGreenCard(connection, card);
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

    broadcastWhiteCard(card: Card){
        this.broadcast('white', card);
    }

    broadcastBlackCard(card: Card){
        this.broadcast('black', card);
    }

    broadcastGreenCard(connection, card: Card){
        console.log(card)
        connection.send(JSON.stringify({ type:'green', data:card }));
    }

    broadcastConnectedPlayerCount() {
        this.broadcast('playerCount', this.connections.length);
    }
}