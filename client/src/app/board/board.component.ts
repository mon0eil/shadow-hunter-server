import { Component, OnInit } from '@angular/core';
import { Pawn } from '../models/pawn.model';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  players: Pawn[] = [
    {
      id: 1,
      x: 750 + Math.random() * 30 + 1,
      y: 350 + Math.random() * 30 + 1,
      color: 'red'
    },
    {
      id: 2,
      x: 300 + Math.random() * 30 + 1,
      y: 575 + Math.random() * 30 + 1,
      color: 'red'
    },
    {
      id: 3,
      x: 750 + Math.random() * 30 + 1,
      y: 350 + Math.random() * 30 + 1,
      color: 'yellow'
    },
    {
      id: 4,
      x: 300 + Math.random() * 30 + 1,
      y: 575 + Math.random() * 30 + 1,
      color: 'yellow'
    },
    {
      id: 5,
      x: 750 + Math.random() * 30 + 1,
      y: 350 + Math.random() * 30 + 1,
      color: 'purple'
    },
    {
      id: 6,
      x: 300 + Math.random() * 30 + 1,
      y: 575 + Math.random() * 30 + 1,
      color: 'purple'
    },
    {
      id: 7,
      x: 750 + Math.random() * 30 + 1,
      y: 350 + Math.random() * 30 + 1,
      color: 'green'
    },
    {
      id: 8,
      x: 300 + Math.random() * 30 + 1,
      y: 575 + Math.random() * 30 + 1,
      color: 'green'
    }
  ];

  color: string[] = [
    'violet', 'black', 'orange', 'blue', 'white'
  ];

  ngOnInit(): void {
  }

  onAddPlayer() {
    const colorPawn = this.color.pop();
    this.players.push({
      id: this.players.length,
      x: 750 + Math.random() * 30 + 1,
      y: 350 + Math.random() * 30 + 1,
      color: colorPawn
    });
    this.players.push({
      id: this.players.length,
      x: 300 + Math.random() * 30 + 1,
      y: 575 + Math.random() * 30 + 1,
      color: colorPawn
    });
  }

  positionChanged(index, event) {
    const player = this.players[index];
    const position = event.source.getFreeDragPosition();
    console.log('changing position of player', player, position);
    player.x = position.x;
    player.y = position.y;
    console.log(this.players);
  }

  getPlayerPosition(player) {
    return {
      x: player.x,
      y: player.y
    };
  }
}
