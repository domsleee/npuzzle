import { Solver } from "./solver";

if (require.main === module) {
  const solver = new Solver(3);
  const res = solver.getAllPaths([
    [0,2,3],
    [1,5,6],
    [4,7,8]
  ]);
}
