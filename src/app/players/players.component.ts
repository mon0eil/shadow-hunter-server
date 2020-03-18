import { Component, OnInit, Output } from '@angular/core';
import { Player } from '../models/player.model';
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  @Output() playerNumber: number;
  players: Player[];
  playerName: string;
  constructor() { }

  ngOnInit() {
    this.initPlayer();
  }

  initPlayer() {
    this.players =  [
      { id: 1, name: 'Dr Nice', posX: 0, posY: 0, injury: 0 },
      { id: 2, name: 'Narco', posX: 0, posY: 0, injury: 0  },
      { id: 3, name: 'Bombasto', posX: 0, posY: 0, injury: 0  },
      { id: 4, name: 'Celeritas', posX: 0, posY: 0, injury: 0  }
    ];
    this.playerNumber = 4;
  }

  onUpdateName(event: Event) {
    this.playerName = (event.target as HTMLInputElement).value;
  }
  onCreatePlayer() {
    this.players.push({ id: this.players.length + 1, name: this.playerName, posX: 0, posY: 0, injury: 0 });
    this.playerNumber = this.players.length;
  }
}
