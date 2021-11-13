import { getSolvedGrid } from "../grid-helpers";
import { permute } from "../helpers";
import { SolveResult } from "../solver";
import { getStringCharSet, toEncodedGridString, ZERO_CHAR, ZERO_CHAR_CODE } from "./astar-solver";
import { BinaryHeap } from "./binary-heap";
import { buildResult, getCFromIndex, getRCFromIndex, getRFromIndex } from "./solver-utils";

interface IAStarNode {
  grid: string;
  zeroIndex: number;
  heuristic: number;
  pathLength: number;
}

export class AStarSolverInner {
  constructor(
    private initialGrid: string,
    private precomputeData: PrecomputeData
  )
  {}

  public solve(): SolveResult {
    let numIterations = 0;
    let dist: {[key: string]: number} = {};
    const heuristicFn = (t: IAStarNode) => t.pathLength + t.heuristic;
    const pq = new BinaryHeap<IAStarNode>(t => heuristicFn(t));
    pq.push(this.getNode(this.initialGrid, 0));
  
    while (pq.size() > 0) {
      numIterations++;
      const top = pq.pop();
      if (top.grid === this.precomputeData.solvedString) {
        return buildResult(numIterations, top.pathLength);
      }
      for (let newGrid of this.precomputeData.getNewGrids(top)) {
        const shortestDist = dist[newGrid];
        const node = this.getNode(newGrid, top.pathLength+1);
        const tentativeGuess = heuristicFn(node);

        if (shortestDist != undefined && tentativeGuess >= shortestDist) {
          continue;
        }
        
        dist[newGrid] = tentativeGuess;
        pq.push(node);
      }
    }

    return {
      numIterations,
      noSolution: true,
      paths: [],
      pathLength: -1,
    }
  }

  private getNode(grid: string, pathLength: number): IAStarNode {
    return {
      grid,
      zeroIndex: grid.indexOf(ZERO_CHAR),
      heuristic: this.getHeuristic(grid),
      pathLength
    }
  }

  private getHeuristic(grid: string): number {
    let res = 0;
    for (let i = 0; i < grid.length; ++i) {
      if (grid[i] === ZERO_CHAR) continue;
      res += this.precomputeData.getTaxiLength(grid[i], i);
    }
    res += 2 * this.precomputeData.getConflicts(grid);
    return res;
  }
}
type ConflictCache = {[key: number]: {[key: string]: number}};

export class PrecomputeData {
  solvedString: string;
  readonly n: number;

  private solvedStringCache: {[key: string]: number} = {};
  private taxiCabCache = Array<Array<number>>();
  private rowConflictCache: ConflictCache = {};
  private colConflictCache: ConflictCache = {};
  private nArray: Array<number> = [];

  constructor(n: number) {
    this.n = n;
    this.nArray = Array(this.n).fill(null).map((t, i) => i);
    this.solvedString = toEncodedGridString(getSolvedGrid(n));
    this.setupSolvedStringCache();
    this.setupTaxiCabCache();
    this.setupRowConflictCache();
  }

  getTaxiLength(charCode: string, index: number): number {
    const expIndex = this.solvedString.indexOf(charCode);
    return this.taxiCabCache[index][expIndex];
    return this.getTaxiCabDistIndexes(index, expIndex);
  }

  getNewGrids(node: IAStarNode): Array<string> {
    const zeroIndex = node.zeroIndex;
    const [r, c] = getRCFromIndex(zeroIndex, this.n);
    const res = new Array<string>();
    const transformWithSwap = (i: number, j: number): string => {
      //if (i > j) [i,j] = [j,i];
      //if (i > j) throw new Error(`ok ${i} > ${j}`);
      const str = node.grid;
      const ret = str.substring(0, i)
        + str[j]
        + str.substring(i+1, j)
        + str[i]
        + str.substring(j+1);
      //if (ret.length !== str.length) throw new Error('???');
      return ret;
    };

    if (r !== 0) res.push(transformWithSwap(zeroIndex - this.n, zeroIndex));
    if (r !== this.n-1) res.push(transformWithSwap(zeroIndex, zeroIndex + this.n));
    if (c !== 0) res.push(transformWithSwap(zeroIndex - 1, zeroIndex));
    if (c !== this.n-1) res.push(transformWithSwap(zeroIndex, zeroIndex + 1));
    return res;
  }

  getConflicts(grid: string): number {
    let res = 0;
    for (let r = 0; r < this.n; ++r) {
      const row = grid.substring(r*this.n, (r+1)*this.n);
      res += this.rowConflictCache[r][row];// this.getRowConflicts(r, row);
      const col = this.getCol(grid, r);
      res += this.colConflictCache[r][col];// this.getColConflicts(r, col);
    }
    return res;
  }

  private setupSolvedStringCache() {
    for (let i = 0; i < this.solvedString.length; ++i) {
      this.solvedStringCache[this.solvedString[i]] = i;
    }
  }

  private setupTaxiCabCache() {
    for (let i = 0; i < this.n*this.n; ++i) {
      this.taxiCabCache.push(new Array(this.n * this.n));
      for (let j = 0; j < this.n * this.n; ++j) {
        this.taxiCabCache[i][j] = this.getTaxiCabDistIndexes(i, j);
      }
    }
  }

  private setupRowConflictCache() {
    this.rowConflictCache = new Array(this.n).fill(null).map(t => ({}));
    this.colConflictCache = new Array(this.n).fill(null).map(t => ({}));

    const charSet = getStringCharSet(this.n);
    const s1 = performance.now();
    const allRows = permute(charSet.join(''), this.n);
    const s2 = performance.now();
    for (let row of allRows) {
      for (let r = 0; r < this.n; ++r) {
        this.rowConflictCache[r][row] = this.getRowConflictsNaive(r, row, c => this.getRowOfChar(c));
        this.colConflictCache[r][row] = this.getRowConflictsNaive(r, row, c => this.getColOfChar(c));
      }
    }
    const s3 = performance.now();
    console.log(s2-s1, s3 - s2);
  }

  private getRowOfChar(char: string) {
    return getRFromIndex(this.solvedString.indexOf(char), this.n);
  }

  private getColOfChar(char: string) {
    return getCFromIndex(this.solvedString.indexOf(char), this.n);

  }

  private getTaxiCabDistIndexes(i: number, j: number): number {
    const [ir, ic] = getRCFromIndex(i, this.n);
    const [jr, jc] = getRCFromIndex(j, this.n);
    return Math.abs(ir - jr) + Math.abs(ic - jc);
  }

  private getRowConflicts(r: number, row: string): number {
    return this.rowConflictCache[r][row];
    return this.getFromConflictCache(this.rowConflictCache, r, row);
    return this.getRowConflictsNaive(r, row, char => this.getRowOfChar(char))
  }

  private getColConflicts(c: number, col: string): number {
    return this.colConflictCache[c][col];
    return this.getFromConflictCache(this.colConflictCache, c, col);
    return this.getRowConflictsNaive(c, col, char => this.getColOfChar(char));
  }

  private getFromConflictCache(cache: ConflictCache, r: number, row: string) {
    if (!(row in cache[r])) throw new Error(`cache miss? cache[${r}][${row}]`);
    return cache[r][row];
  }

  getRowConflictsNaive(r: number, row: string, getTarget: (char: string) => number): number {
    let res = 0;
    while (true) {
      let rowConflicts = new Array(row.length).fill(0);
      let M = 0;
      for (let i = 0; i < row.length-1; ++i) {
        if (row[i] === ZERO_CHAR) continue;
        const rowITarget = getTarget(row[i]);
        if (rowITarget != r) continue;
  
        for (let j = i+1; j < row.length; ++j) {
          if (row[j] === ZERO_CHAR) continue;
          if (row[i] > row[j] && rowITarget === getTarget(row[j])) {
            rowConflicts[i]++;
            rowConflicts[j]++;
            M = Math.max(M, Math.max(rowConflicts[i], rowConflicts[j]));
          }
        }
      }
      if (M > 0) {
        res++;
        const maxInd = rowConflicts.indexOf(M);
        row = row.substring(0, maxInd) + row.substring(maxInd + 1);
      } else {
        break;
      }
    }
    //row = row.replace(this.zeroChar, '');
    
    return res;
  }

  private getCol(grid: string, c: number) {
    //return this.nArray.map(t => grid[t*this.n + c]).join('');

    let res = '';
    for (let r = 0; r < this.n; ++r) res += grid[r*this.n + c];
    return res;
  }
}