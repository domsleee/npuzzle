import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SquareModel } from '../models/square-model';
import { Movement } from '../utils/defs';
import { doAction, getRandomGrid, getSolvedGrid, gridEquals } from '../utils/grid-helpers';
import { Grid } from '../utils/solver';
import { TimerService } from './timer.service';

export interface IGameState {
  squares: Array<SquareModel>,
  grid: Grid,
  numMoves: number;
  gameOver: boolean;
  timer: Observable<number>;
};

@Injectable()
export class GameService {
  private n = -1;
  private initialGrid?: Grid;
  gameOver = new Subject<boolean>();
  state: IGameState = this.getDefaultState();

  constructor(
    private timerService: TimerService
  ) { }

  setupGame(n: number, seed?: string) {
    if (this.timerService.isRunning()) this.timerService.stopTimer();
    this.n = n;
    this.state = this.getDefaultState();
    this.state.squares = Array(n * n).fill(null).map((t, i) => new SquareModel(i));
    this.state.grid = getRandomGrid(n, seed);
    this.initialGrid = getSolvedGrid(n);
    this.syncSquaresFromGrid();
  }

  doAction(movement: Movement) {
    if (doAction(this.state.grid, movement)) {
      if (!this.timerService.isRunning())
        this.state.timer = this.timerService.startTimer();
      this.state.numMoves++;
      this.syncSquaresFromGrid();
      if (gridEquals(this.initialGrid!, this.state.grid)) {
        this.state.gameOver = true;
        this.timerService.stopTimer();
        this.gameOver.next(true);
      }
    }
  }

  private getDefaultState(): IGameState {
    return {
      squares: [],
      grid: [],
      numMoves: 0,
      gameOver: false,
      timer: new BehaviorSubject(0)
    };
  }

  private syncSquaresFromGrid() {
    for (let r = 0; r < this.n; ++r) {
      for (let c = 0; c < this.n; ++c) {
        const ind = this.state.grid[r][c];
        this.state.squares[ind].r = r;
        this.state.squares[ind].c = c;
      }
    }
  }
}
