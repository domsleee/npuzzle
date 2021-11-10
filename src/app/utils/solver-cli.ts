import { SolveService } from "../services/solve.service";
import { Grid } from "./solver";
// @ts-ignore
import esMain from 'es-main';

console.log('hi');

export class SolverCli {
  main() {
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
    const solverService = new SolveService();
    console.log(solverService.getShortestPath(gridToUse));
    if (gridToUse !== hardGrid) console.log(solverService.getAllPaths(gridToUse));
  }
}

if (esMain(import.meta)) {
  new SolverCli().main();
}
