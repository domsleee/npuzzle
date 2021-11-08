import seedrandom from "seedrandom";
import { ALL_MOVEMENTS, Movement } from "./defs";
import { getRandomSeed } from "./helpers";
import { Grid } from "./solver";

export function getSolvedGrid(n: number): Grid {
  const res: Grid = [];
  for (let r = 0; r < n; ++r) {
    res.push([]);
    for (let c = 0; c < n; ++c) {
      res[r].push(r * n + c + 1);
    }
  }
  res[n-1][n-1] = 0;
  return res;
}

export function getRandomGrid(n: number, seed?: string) {
  const grid = getSolvedGrid(n);
  const rng = seedrandom(seed ?? getRandomSeed());
  for (let i = 0; i < 1000; ++i) {
    doAction(grid, ALL_MOVEMENTS[Math.floor(rng() * 4)]);
  }
  return grid;
}

export function doAction(grid: Grid, movement: Movement): boolean {
  const n = grid.length;
  let [r, c] = findSquare(grid, 0);
  const deltas: {[K in Movement]: [number, number]} = {
    'LEFT': [0, 1],
    'RIGHT': [0, -1],
    'UP': [1, 0],
    'DOWN': [-1, 0]
  };
  const delta = deltas[movement];
  let [nr, nc] = [r + delta[0], c + delta[1]];
  if (nr < 0 || nr >= n || nc < 0 || nc >= n) return false;

  [grid[r][c], grid[nr][nc]] = [grid[nr][nc], grid[r][c]];
  return true;
}

function findSquare(grid: Grid, digit: number) {
  const n = grid.length;
  for (let r = 0; r < n; ++r) {
    for (let c = 0; c < n; ++c) {
      if (grid[r][c] === digit) return [r, c];
    }
  }
  throw new Error(`could not find digit ${digit}`);
}

export function gridEquals(grid1: Grid, grid2: Grid) {
  if (grid1.length !== grid2.length) return false;
  for (let r = 0; r < grid1.length; ++r) {
    for (let c = 0; c < grid1.length; ++c) {
      if (grid1[r][c] !== grid2[r][c]) return false;
    }
  }
  return true;
}
