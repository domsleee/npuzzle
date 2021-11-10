import { SolveResult } from "../solver";

export function buildResult(numIterations: number, pathLength: number): SolveResult {
  return {
    noSolution: false,
    numIterations,
    pathLength,
    paths: [[]]
  };
}

export function getRCFromIndex(index: number, n: number) {
  return [getRFromIndex(index, n), getCFromIndex(index, n)];
}

export function getRFromIndex(index: number, n: number) {
  return ~~(index/n);
}

export function getCFromIndex(index: number, n: number) {
  return index % n;
}