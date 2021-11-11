import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService, IGameState } from 'src/app/services/game.service';
import { KeyboardEventsService } from 'src/app/services/keyboard-events.service';
import { SolveService } from 'src/app/services/solve.service';
import { KeyCodeMovement, KEYCODE_MOVEMENTS, Movement } from 'src/app/utils/defs';
import { getRandomSeed } from 'src/app/utils/helpers';
import { Grid, Solver } from 'src/app/utils/solver';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_N = 3;

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
  shortestPath: number = -1;
  n = DEFAULT_N;
  faRedoAlt = faRedoAlt;
  initialGrid?: Grid;

  private seed?: string;

  constructor(
    private keyboardEventsService: KeyboardEventsService,
    private gameService: GameService,
    private solveService: SolveService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.seed = this.activatedRoute.snapshot.queryParams['seed'];
    const nParam = this.activatedRoute.snapshot.queryParams['n'];
    this.n = parseInt(nParam ?? DEFAULT_N);
    if (!nParam) {
      this.router.navigate(['/play'], {queryParams: {n: DEFAULT_N}});
    }

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
        setTimeout(() => this.findAndSetShortestPath(), 100);
      })
    ];
    const seed = this.seed ?? getRandomSeed();
    this.start(seed);
  }

  ngOnDestroy() {
    this.keyboardEventsService.detachListeners();
    this.subs.forEach(t => t.unsubscribe());
  }

  restart() {
    this.start(this.seed ?? getRandomSeed());
  }

  private start(seed?: string) {
    console.log(`start with seed ${seed}`);
    this.shortestPath = -1;
    this.gameService.setupGame(this.n, this.seed);
    this.gameState = this.gameService.state;
    this.initialGrid = JSON.parse(JSON.stringify(this.gameState.grid));
    console.log(JSON.stringify(this.initialGrid));

    //if (seed) this.findSmallestPath();
  }

  private findAndSetShortestPath() {
    const res = this.solveService.getShortestPath(this.initialGrid!);
    this.shortestPath = res.pathLength;
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
