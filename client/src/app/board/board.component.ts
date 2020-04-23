import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Pawn } from '../../../../server/interface/pawn.model';
import { ServerService } from '../services/server.service';
import { Space } from '../../../../server/interface/space.model';
import { Card } from '../../../../server/interface/card.model';
import copy from 'copy-to-clipboard';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements AfterViewInit {

  constructor(
    private serverService: ServerService
  ) {}

  players: Pawn[] = [];
  spaces: Space[] = [];

  white: Card = null;
  black: Card = null;
  green: Card = null;
  dices = {
    six: null,
    four: null
  };
  text = '';

  @ViewChild('boundaries') boundaries;
  @ViewChild('textzone') textZone;

  ngAfterViewInit(): void {
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
    this.serverService.dices$.subscribe(dices => {
      this.showRandomDice(0, dices);
    });
    this.serverService.text$.subscribe(text => {
      const sel = getInputSelection(this.textZone.nativeElement);
      this.textZone.nativeElement.value = text;
      setInputSelection(this.textZone.nativeElement, sel.start, sel.end);
    });
  }

  randomizeDice() {
    this.dices = {
      six: Math.ceil(Math.random() * 6),
      four: Math.ceil(Math.random() * 4)
    };
  }

  showRandomDice(iteration: number, result) {
    setTimeout(() => {
      if (iteration < 10) {
        this.randomizeDice();
        this.showRandomDice(iteration + 1, result);
      } else {
        this.dices = result;
      }
    }, 50);
  }

  onAddPlayer() {
    this.serverService.requestPawnCreation();
  }

  positionChanged(index, event) {
    const player = this.players[index];
    const position = event.source.getFreeDragPosition();
    const boundariesBox = this.boundaries.nativeElement.getBoundingClientRect();
    const x = position.x / boundariesBox.width;
    const y = position.y / boundariesBox.height;
    player.x = x;
    player.y = y;
    this.serverService.requestPawnMove(player.id, x, y);
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

  write() {
    setTimeout(() => {
      this.serverService.sendMessage('write', this.textZone.nativeElement.value);
    }, 5);
  }

  throwDices() {
    this.serverService.requestDiceThrow();
  }

  hideGreenCard() {
    this.green = null;
  }

  getPlayerPosition(player) {
    const boundariesBox = this.boundaries.nativeElement.getBoundingClientRect();
    return {
      x: player.x * boundariesBox.width,
      y: player.y * boundariesBox.height
    };
  }

  playerTrack(player) {
    return player.id;
  }

  copyWhiteCard() {
    if (this.white) {
      copy(this.white.name);
    }
  }

  copyBlackCard() {
    if (this.black) {
      copy(this.black.name);
    }
  }

  copyGreenCard(event) {
    event.stopPropagation();
    if (this.green) {
      copy(this.green.effect);
    }
  }
}

// Copied code :D
function getInputSelection(el) {
  let start = 0;
  let end = 0;
  let normalizedValue;
  let range;
  let textInputRange;
  let len;
  let endRange;

  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
      start = el.selectionStart;
      end = el.selectionEnd;
  } else {
      range = (document as any).selection.createRange();

      if (range && range.parentElement() == el) {
          len = el.value.length;
          normalizedValue = el.value.replace(/\r\n/g, "\n");

          // Create a working TextRange that lives only in the input
          textInputRange = el.createTextRange();
          textInputRange.moveToBookmark(range.getBookmark());

          // Check if the start and end of the selection are at the very end
          // of the input, since moveStart/moveEnd doesn't return what we want
          // in those cases
          endRange = el.createTextRange();
          endRange.collapse(false);

          if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
              start = end = len;
          } else {
              start = -textInputRange.moveStart("character", -len);
              start += normalizedValue.slice(0, start).split("\n").length - 1;

              if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                  end = len;
              } else {
                  end = -textInputRange.moveEnd("character", -len);
                  end += normalizedValue.slice(0, end).split("\n").length - 1;
              }
          }
      }
  }

  return {
      start: start,
      end: end
  };
}

function offsetToRangeCharacterMove(el, offset) {
  return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
}

function setInputSelection(el, startOffset, endOffset) {
  if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
      el.selectionStart = startOffset;
      el.selectionEnd = endOffset;
  } else {
      var range = el.createTextRange();
      var startCharMove = offsetToRangeCharacterMove(el, startOffset);
      range.collapse(true);
      if (startOffset == endOffset) {
          range.move("character", startCharMove);
      } else {
          range.moveEnd("character", offsetToRangeCharacterMove(el, endOffset));
          range.moveStart("character", startCharMove);
      }
      range.select();
  }
}
