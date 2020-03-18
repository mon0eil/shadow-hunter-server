import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Space } from '../models/space.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  spacelist: Space[];

  players = [
    {
      x: 10,
      y: 50,
      color: 'red'
    },
    {
      x: 50,
      y: 100,
      color: 'yellow'
    }
  ];


  ngOnInit(): void {
    this.spaceInit();
    this.shuffle();
  }

  spaceInit() {
    this.spacelist = [
      {number: '2/3', name: 'Ermite' },
      {number: '4/5', name: 'Abyss' },
      {number: '6', name: 'Monastère' },
      {number: '8', name: 'Cimetière' },
      {number: '9', name: 'Forêt hantée' },
      {number: '10', name: 'Sanctuaire ancien' }
    ];
  }

  shuffle() {
    let i: number;
    let j: number;
    let x: Space;
    let y: number;
    for (y = 0; y <= 3; y++) {
      for (i = 0; i < 6; i++) {
        j = Math.floor(Math.random() * (i + 1));
        x = this.spacelist[i];
        this.spacelist[i] = this.spacelist[j];
        this.spacelist[j] = x;
      }
    }
  }

  positionChanged(index, event) {
    const player = this.players[index];
    const position = event.source.getFreeDragPosition();
    console.log('changing position of player', player, position);
    player.x = position.x;
    player.y = position.y;
    console.log(this.players);

    setTimeout(() => {
      // after 2s, move the player to the right for testing :)
      player.x = player.x + 50;
    }, 2000);
  }

  getPlayerPosition(player) {
    return {
      x: player.x,
      y: player.y
    };
  }
}
