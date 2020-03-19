import { Component, OnInit } from '@angular/core';
import { Pawn } from '../../../../interface/pawn.model';
import { ServerService } from '../services/server.service';
import { Space } from '../../../../interface/space.model';
import { Card } from '../../../../interface/card.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor(
    private serverService: ServerService
  ) {}

  players: Pawn[] = [];
  spaces: Space[] = [];

  white: Card = null;
  black: Card = null;
  green: Card = null;
  color: string[] = [
    'violet', 'black', 'orange', 'blue', 'white', 'purple', 'green', 'orange', 'red'
    ];

  ngOnInit(): void {
    this.serverService.connect();

    this.serverService.pawns$.subscribe(pawns => {
      this.players = pawns;
    });
    this.serverService.spaces$.subscribe(spaces => {
      this.spaces = spaces;
    });
    this.serverService.whiteCard$.subscribe(white => {
      this.white = white;
    });
    this.serverService.blackCard$.subscribe(black => {
      this.black = black;
    });
    this.serverService.greenCard$.subscribe(green => {
      this.green = green;
    });
  }

  onAddPlayer() {
    this.serverService.requestPawnCreation(this.color.pop());
  }

  positionChanged(index, event) {
    const player = this.players[index];
    const position = event.source.getFreeDragPosition();
    player.x = position.x;
    player.y = position.y;
    this.serverService.requestPawnMove(player.id, position.x, position.y);
  }

  reset() {
    this.serverService.sendMessage('reset');
  }

  shuffle() {
    this.serverService.sendMessage('shuffle');
  }

  drawWhiteCard() {
    this.serverService.sendMessage('drawWhite');
  }

  drawBlackCard() {
    this.serverService.sendMessage('drawBlack');
  }

  drawGreenCard() {
    this.serverService.sendMessage('drawGreen');
  }
  getPlayerPosition(player) {
    return {
      x: player.x,
      y: player.y
    };
  }
}
