import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Space } from '../../../../server/interface/space.model';
import { Pawn } from '../../../../server/interface/pawn.model';
import { Card } from '../../../../server/interface/card.model';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  socket;

  pawns$: Subject<Pawn[]> = new Subject<Pawn[]>();
  spaces$: Subject<Space[]> = new Subject<Space[]>();
  whiteCard$: Subject<Card> = new Subject<Card>();
  blackCard$: Subject<Card> = new Subject<Card>();
  greenCard$: Subject<Card> = new Subject<Card>();
  dices$: Subject<any> = new Subject<any>();
  text$: Subject<string> = new Subject<string>();

  constructor() { }

  connect() {
    this.socket = new WebSocket('ws://' + document.location.host);

    this.socket.onopen = () => {
      console.log('connected');
    };

    this.socket.onmessage = message => {
      const jsonMessage = JSON.parse(message.data);
      this.handleMessage(jsonMessage.type, jsonMessage.data);
    };
  }

  handleMessage(type: string, data: any) {
    console.log('got message : ', type, data);
    switch (type) {
      case 'pawns':
        this.handlePawns(data);
        break;
      case 'spaces':
        this.handleSpaces(data);
        break;
      case 'white':
        this.handleWhiteCard(data);
        break;
      case 'black':
        this.handleBlackCard(data);
        break;
      case 'green':
        this.handleGreenCard(data);
        break;
      case 'dices':
        this.handleDices(data);
        break;
      case 'text':
        this.handleText(data);
        break;
    }
  }

  handlePawns(pawns: Pawn[]) {
    this.pawns$.next(pawns);
  }

  handleSpaces(spaces: Space[]) {
    this.spaces$.next(spaces);
  }

  handleWhiteCard(card: Card) {
    this.whiteCard$.next(null);
    setTimeout(() => {
      this.whiteCard$.next(card);
    }, 150);
  }

  handleBlackCard(card: Card) {
    this.blackCard$.next(null);
    setTimeout(() => {
      this.blackCard$.next(card);
    }, 150);
  }

  handleGreenCard(card: Card) {
    this.greenCard$.next(null);
    setTimeout(() => {
      this.greenCard$.next(card);
    }, 150);
  }

  handleDices(dices) {
    this.dices$.next(dices);
  }

  handleText(text) {
    this.text$.next(text);
  }

  requestPawnCreation() {
    this.sendMessage('create');
  }

  requestDiceThrow() {
    this.sendMessage('throwDices');
  }

  requestPawnMove(id: number, x: number, y: number) {
    this.sendMessage('move', {
      id,
      x,
      y
    });
  }

  requestWrite(text: string) {
    this.sendMessage('write', text);
  }

  sendMessage(type: string, data?: any) {
    if (!this.socket) {
      return;
    }

    this.socket.send(JSON.stringify({ type, data }));
  }
}
