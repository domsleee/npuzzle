import { Component, OnInit } from '@angular/core';
import { SolveService } from 'src/app/services/solve.service';
import { AStarSolver } from 'src/app/utils/astar/astar-solver';
import { Grid, Solver } from 'src/app/utils/solver';

@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.scss']
})
export class SolveComponent implements OnInit {

  constructor(
    private solverService: SolveService
  ) { }

  ngOnInit(): void {
    const hardGrid: Grid = [
      [14,4,1,10],
      [7,9,0,15],
      [3,6,8,12],
      [5,2,13,11]
    ];
    const easyGrid: Grid = [
      [0,2,3],
      [1,5,6],
      [4,7,8]
    ];
    const mediumGrid: Grid = [
      [0,1,4],
      [3,8,5],
      [7,2,6]
    ];

    const gridToUse = hardGrid;
    console.log(this.solverService.getShortestPath(gridToUse));
    if (gridToUse !== hardGrid) console.log(this.solverService.getAllPaths(gridToUse));

  }

}
