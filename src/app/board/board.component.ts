import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Space } from '../models/space.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  spacelist: Space[];


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
}
