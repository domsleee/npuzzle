import { SolveService } from "../services/solve.service";
// @ts-ignore
import esMain from 'es-main';
import { apparently1660, hardGrid, impossibleGrid } from "./solver-cases";

console.log('hi');

export class SolverCli {
  main() {
    const gridToUse = apparently1660;
    const solverService = new SolveService();
    console.log(solverService.getShortestPath(gridToUse))
    if (gridToUse.length <= 3) console.log(solverService.getAllPaths(gridToUse));
  }
}

if (esMain(import.meta)) {
  new SolverCli().main();
}
