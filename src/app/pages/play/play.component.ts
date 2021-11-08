import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService, IGameState } from 'src/app/services/game.service';
import { KeyboardEventsService } from 'src/app/services/keyboard-events.service';
import { SolveService } from 'src/app/services/solve.service';
import { KeyCodeMovement, KEYCODE_MOVEMENTS, Movement } from 'src/app/utils/defs';
import { getRandomSeed } from 'src/app/utils/helpers';
import { Grid, Solver } from 'src/app/utils/solver';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  providers: [
    GameService,
    KeyboardEventsService
  ]
})
export class PlayComponent implements OnInit {
  subs = new Array<Subscription>();
  gameState!: IGameState;
  smallestPath: number = -1;
  n = 3;
  faRedoAlt = faRedoAlt;
  initialGrid?: Grid;

  private seed: string = '';

  constructor(
    private keyboardEventsService: KeyboardEventsService,
    private gameService: GameService,
    private solveService: SolveService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.keyboardEventsService.attachListeners();
    this.subs = [
      this.keyboardEventsService.keydownFirstTime.subscribe(keyCode => {
        if (!this.gameState.gameOver && KEYCODE_MOVEMENTS.includes(keyCode)) {
          this.doAction(keyCode as KeyCodeMovement);
        }
        else if (keyCode === 'r') {
          this.restart();
        }
      }),
      this.gameService.gameOver.subscribe(() => {
        setTimeout(() => this.findAndSetSmallestPath(), 100);
      })
    ];
    const seed = this.activatedRoute.snapshot.params['seed'] ?? getRandomSeed();
    this.start(seed);
  }

  ngOnDestroy() {
    this.keyboardEventsService.detachListeners();
    this.subs.forEach(t => t.unsubscribe());
  }

  restart() {
    this.start(getRandomSeed());
  }

  private start(seed?: string) {
    console.log(`start with seed ${seed}`)
    if (seed) {
      this.smallestPath = -1;
      this.seed = seed;
    }
    this.gameService.setupGame(this.n, this.seed);
    this.gameState = this.gameService.state;
    this.initialGrid = JSON.parse(JSON.stringify(this.gameState.grid));

    //if (seed) this.findSmallestPath();
  }

  private findAndSetSmallestPath() {
    const res = this.solveService.getAllPaths(this.initialGrid!);
    this.smallestPath = res.pathLength;
    console.log(this, res);
  }

  private doAction(keyCodeMovement: KeyCodeMovement) {
    let action: Movement = this.keyCodeMovementToMovement(keyCodeMovement);
    this.gameService.doAction(action);
  }

  private keyCodeMovementToMovement(keyCode: KeyCodeMovement): Movement {
    switch(keyCode) {
      case 'ArrowDown': return 'DOWN';
      case 'ArrowUp': return 'UP';
      case 'ArrowLeft': return 'LEFT';
      case 'ArrowRight': return 'RIGHT';
    }
    throw new Error('impossible');
  }
}
