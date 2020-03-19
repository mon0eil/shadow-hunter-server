import { Component, OnInit } from '@angular/core';
import { Pawn } from '../models/pawn.model';
import { ServerService } from '../services/server.service';

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

  color: string[] = [
    'violet', 'black', 'orange', 'blue', 'white'
  ];

  ngOnInit(): void {
    this.serverService.connect();

    this.serverService.pawns$.subscribe(pawns => {
      this.players = pawns;
    })
  }

  onAddPlayer() {
    this.serverService.requestPawnCreation(this.color.pop());
  }

  positionChanged(index, event) {
    const player = this.players[index];
    const position = event.source.getFreeDragPosition();
    this.serverService.requestPawnMove(player.id, position.x, position.y);
  }

  reset() {
    this.serverService.sendMessage('reset');
  }

  getPlayerPosition(player) {
    return {
      x: player.x,
      y: player.y
    };
  }
}
