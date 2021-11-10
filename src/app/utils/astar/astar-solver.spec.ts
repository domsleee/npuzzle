import { AStarSolver } from "./astar-solver";

describe('Solver', () => {
  it('simple solution', () => {
    const solver = new AStarSolver();
    const res = solver.getShortestPath([
      [1,2,3],
      [4,5,6],
      [7,0,8]
    ]);
    expect(res.pathLength).toEqual(1);
  });

  it('expected solution', () => {
    const solver = new AStarSolver();
    const res = solver.getShortestPath([
      [0,2,3],
      [1,5,6],
      [4,7,8]
    ]);
    expect(res.pathLength).toEqual(4);
  });

  it('no move solution', () => {
    const solver = new AStarSolver();
    const res = solver.getShortestPath([
      [1,2,3],
      [4,5,6],
      [7,8,0]
    ]);
    expect(res.pathLength).toEqual(0);
  });

  it('multiple paths solution', () => {
    expect(true).toBe(true); // todo: is there even a case like this?
  });
});
