import { Injectable } from '@angular/core';
import { AStarSolver } from '../utils/astar/astar-solver';
import { Movement } from '../utils/defs';
import { Grid, Solver, SolveResult } from '../utils/solver';

interface IPerformanceData {
  timeTakenMs: number;
  precomputeTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SolveService {

  constructor() {
  }

  getAllPaths(grid: Readonly<Grid>): SolveResult & IPerformanceData {
    const solver = new Solver(grid.length);
    const startTime = performance.now()
    const res = solver.getAllPaths(grid);
    const endTime = performance.now()

    return {
      ...res,
      timeTakenMs: endTime - startTime
    };
  }

  getShortestPath(grid: Readonly<Grid>): SolveResult & IPerformanceData {
    const startTime = performance.now();
    const solver = new AStarSolver();
    solver.precomputeForGridSize(grid.length);
    const procTime = performance.now()
    const res = solver.getShortestPath(grid);
    const endTime = performance.now()

    return {
      ...res,
      precomputeTime: procTime - startTime,
      timeTakenMs: endTime - startTime
    };
  }
}
