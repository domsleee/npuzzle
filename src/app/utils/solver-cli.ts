import { SolveService } from "../services/solve.service";
// @ts-ignore
import esMain from 'es-main';
import { impossibleGrid } from "./solver-cases";

console.log('hi');

export class SolverCli {
  main() {
    const gridToUse = impossibleGrid;
    const solverService = new SolveService();
    if (gridToUse.length <= 3) console.log(solverService.getAllPaths(gridToUse));
  }
}

if (esMain(import.meta)) {
  new SolverCli().main();
}
