import { Injectable } from '@angular/core';
import { Movement } from '../utils/defs';
import { Grid, Solver, SolveResult } from '../utils/solver';

interface IPerformanceData {
  timeTakenMs: number;
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
}
