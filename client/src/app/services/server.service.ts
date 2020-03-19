import { Injectable } from '@angular/core';
import { Pawn } from '../models/pawn.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  socket;

  pawns$: Subject<Pawn[]> = new Subject<Pawn[]>();

  constructor() { }

  connect() {
    this.socket = new WebSocket('ws://darckoune.moe:13475');

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
    }
  }

  handlePawns(pawns: Pawn[]) {
    this.pawns$.next(pawns);
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
