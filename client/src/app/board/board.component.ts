import { Component, OnInit } from '@angular/core';
import { Pawn } from '../../../../interface/pawn.model';
import { ServerService } from '../services/server.service';
import { Space } from '../../../../interface/space.model';

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

  color: string[] = [
    'violet', 'black', 'orange', 'blue', 'white'
  ];

  ngOnInit(): void {
    this.serverService.connect();

    this.serverService.pawns$.subscribe(pawns => {
      this.players = pawns;
    });
    this.serverService.spaces$.subscribe(spaces => {
      this.spaces = spaces;
    });
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

  shuffle() {
    this.serverService.sendMessage('shuffle');
    console.log(this.spaces);
  }

  getPlayerPosition(player) {
    return {
      x: player.x,
      y: player.y
    };
  }
}
