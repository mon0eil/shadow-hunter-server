import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Space } from '../../../../interface/space.model';
import { Pawn } from '../../../../interface/pawn.model';
import { Card } from '../../../../interface/card.model';
@Injectable({
  providedIn: 'root'
})
export class ServerService {

  socket;

  pawns$: Subject<Pawn[]> = new Subject<Pawn[]>();
  spaces$: Subject<Space[]> = new Subject<Space[]>();
  whiteCard$: Subject<Card> = new Subject<Card>();

  constructor() { }

  connect() {
    this.socket = new WebSocket('ws://localhost:13475');

    this.socket.onopen = () => {
      console.log('connected');
    };

    this.socket.onmessage = message => {
      const jsonMessage = JSON.parse(message.data);
      this.handleMessage(jsonMessage.type, jsonMessage.data);
    };
  }

  handleMessage(type: string, data: any) {
    switch (type) {
      case 'pawns':
        this.handlePawns(data);
        break;
      case 'spaces':
        this.handleSpaces(data);
        break;
      case 'white':
        this.handleWhiteCard(data);
    }
  }

  handlePawns(pawns: Pawn[]) {
    this.pawns$.next(pawns);
  }

  handleSpaces(spaces: Space[]) {
    this.spaces$.next(spaces);
  }

  handleWhiteCard(card: Card) {
    this.whiteCard$.next(card);
  }

  requestPawnCreation(color: string) {
    this.sendMessage('create', color);
  }

  requestPawnMove(id: number, x: number, y: number) {
    this.sendMessage('move', {
      id,
      x,
      y
    });
  }

  sendMessage(type: string, data?: any) {
    if (!this.socket) {
      return;
    }

    this.socket.send(JSON.stringify({ type, data }));
  }
}
