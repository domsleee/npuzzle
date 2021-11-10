import { getSolvedGrid } from "../grid-helpers";
import { getZeroMoveResult, Grid, SolveResult } from "../solver";
import { AStarSolverInner, PrecomputeData } from "./astar-solver-inner";

export class AStarSolver {
  private precomputeData: {[key: number]: PrecomputeData} = {};

  getShortestPath(grid: Readonly<Grid>): SolveResult {
    const initialGrid = toEncodedGridString(grid);
    const solvedGrid = toEncodedGridString(getSolvedGrid(grid.length));

    if (initialGrid === solvedGrid) {
      return getZeroMoveResult();
    }

    const solver = new AStarSolverInner(initialGrid, this.precomputeForGridSize(Math.sqrt(initialGrid.length)));
    return solver.solve();
  }

  precomputeForGridSize(n: number): PrecomputeData {
    if (n in this.precomputeData) return this.precomputeData[n];
    console.log('precompute', n);
    return this.precomputeData[n] = new PrecomputeData(n);
  }
}

export function getStringCharSet(n: number): Array<string> {
  let res = new Array<string>(n*n);
  for (let i = 0; i < n*n; ++i) {
    res[i] = String.fromCharCode(getZeroCharCode() + i);
  }
  return res;
}

export function toEncodedGridString(grid: Readonly<Grid>): string {
  let res = '';
  for (let r = 0; r < grid.length; ++r) {
    for (let c = 0; c < grid.length; ++c) {
      res += String.fromCharCode(getZeroCharCode() + grid[r][c]);
    }
  }
  return res;
}

export function getZeroCharCode(): number {
  return getZeroChar().charCodeAt(0);
}

export function getZeroChar(): string {
  return 'A';
}