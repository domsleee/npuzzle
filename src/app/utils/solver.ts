import { Movement } from './defs';
import Denque from 'denque';
import { getSolvedGrid } from './grid-helpers';

export interface SolveResult {
  noSolution: boolean;
  pathLength: number;
  paths: Array<Array<Movement>>;
  numIterations: number;
};

export type Grid = Array<Array<number>>;
type FlatGrid = Array<number>;

interface Node {
  flatGrid: FlatGrid;
  pathLength: number;
};

const ITERATION_LIMIT = 1e7;

export class Solver {
  constructor(private n: number) {}

  getAllPaths(grid: Readonly<Grid>): SolveResult {
    const seen = new MyMap<FlatGrid, number>();
    const pred = new MyMap<FlatGrid, Array<FlatGrid>>();
    const q = new Denque<Node>();
    const initialFlatGrid = this.toFlatGrid(grid);
    q.push({
      flatGrid: initialFlatGrid,
      pathLength: 0
    });
    seen.set(initialFlatGrid, 0);
    const solvedFlatGrid = this.getSolvedFlatGrid();

    if (this.flatGridEquals(initialFlatGrid, solvedFlatGrid)) {
      return getZeroMoveResult();
    }

    let numIterations = 0;
    let solvedLength = -1;

    while (!q.isEmpty()) {
      const top = q.shift()!;

      if (numIterations++ >= ITERATION_LIMIT) {
        console.log('gave up after a few iterations', top.pathLength);
        break;
      }

      if (solvedLength !== -1 && top.pathLength >= solvedLength) {
        break;
      }

      const nextPathLength = top.pathLength + 1;
      for (const nextFlatGrid of this.getNextFlatGrids(top.flatGrid)) {
        const flatGridPathLength = seen.get(nextFlatGrid);
        if (flatGridPathLength !== undefined && flatGridPathLength <= nextPathLength) {
          if (flatGridPathLength === nextPathLength) {
            pred.get(nextFlatGrid)!.push(top.flatGrid);
            if (this.flatGridEquals(nextFlatGrid, solvedFlatGrid)) {
              solvedLength = nextPathLength;
            }
          }
          continue;
        }
        // if (flatGridPathLength !== undefined) {
        //   throw new Error('shouldnt be possible?');
        // }
        seen.set(nextFlatGrid, nextPathLength);
        pred.set(nextFlatGrid, [top.flatGrid]);
        q.push({
          flatGrid: nextFlatGrid,
          pathLength: nextPathLength
        });
      }
    }

    let noSolution = !pred.has(solvedFlatGrid);
    return {
      noSolution,
      numIterations,
      pathLength: noSolution ? -1 : seen.get(solvedFlatGrid)!,
      paths: noSolution ? [] : this.backtrack(initialFlatGrid, solvedFlatGrid, pred), // backtrack
    };
  }

  private backtrack(start: FlatGrid, end: FlatGrid, pred: MyMap<FlatGrid, Array<FlatGrid>>): Array<Array<Movement>> {
    const res: Array<Array<Movement>> = [];
    const st: Array<Array<FlatGrid>> = [];
    st.push([end]);
    while (st.length > 0) {
      const top = st.pop()!;
      const arr = pred.get(top[top.length - 1]);
      if (!arr) {
        res.push(this.flatGridPathToMovementPath(top));
        continue;
      }
      for (let a of arr) {
        st.push([...top, a]);
      }
    }

    return res;
  }

  private flatGridPathToMovementPath(arr: Array<FlatGrid>): Array<Movement> {
    const rev = arr.reverse();
    const res: Array<Movement> = [];
    for (let i = 0; i < arr.length-1; ++i) {
      const z1 = arr[i].indexOf(0);
      const z2 = arr[i+1].indexOf(0);
      if (z1+1 === z2) res.push('LEFT');
      else if (z1-1 === z2) res.push('RIGHT');
      else if (z1-this.n === z2) res.push('DOWN');
      else if (z1+this.n === z2) res.push('UP');
    }
    return res;
  }

  private flatGridEquals(v1: FlatGrid, v2: FlatGrid) {
    return v1.length === v2.length && v1.every((val, i) => val === v2[i]);
  }

  private toFlatGrid(grid: Readonly<Grid>): FlatGrid {
    return grid.flatMap(t => t);
  }

  private *getNextFlatGrids(flatGrid: Readonly<FlatGrid>): Generator<FlatGrid> {
    const zeroIndex = flatGrid.indexOf(0);
    const r = Math.floor(zeroIndex / this.n);
    const c = zeroIndex % this.n;
    if (r !== 0) yield this.transformWithSwap(flatGrid, zeroIndex, zeroIndex - this.n);
    if (r !== this.n-1) yield this.transformWithSwap(flatGrid, zeroIndex, zeroIndex + this.n);
    if (c !== 0) yield this.transformWithSwap(flatGrid, zeroIndex, zeroIndex - 1);
    if (c !== this.n-1) yield this.transformWithSwap(flatGrid, zeroIndex, zeroIndex + 1);
  }

  private transformWithSwap(flatGrid: Readonly<FlatGrid>, i: number, j: number): FlatGrid {
    const ret = flatGrid.map(t => t);
    [ret[i], ret[j]] = [ret[j], ret[i]];
    return ret;
  }

  private getSolvedFlatGrid(): FlatGrid {
    return this.toFlatGrid(getSolvedGrid(this.n));
  }
}

class MyMap<K extends Array<number>, V> {
  private readonly map: {[key: string]: V} = {};
  
  get(key: K): V | undefined {
    return this.map[this.toKey(key)];
  }

  has(key: K): boolean {
    return this.toKey(key) in this.map;
  }

  set(key: K, value: V) {
    this.map[this.toKey(key)] = value;
  }

  get size(): number {
    return Object.keys(this.map).length;
  }

  private toKey(key: K): string {
    return key.join('-');
  }
}

export function getZeroMoveResult(): SolveResult {
  return {
    noSolution: false,
    numIterations: 0,
    pathLength: 0,
    paths: [[]]
  };
}
