import { Solver } from "./solver";

describe('Solver', () => {
  it('simple solution', () => {
    const solver = new Solver(3);
    const res = solver.getAllPaths([
      [1,2,3],
      [4,5,6],
      [7,0,8]
    ]);
    expect(res.pathLength).toEqual(1);
    expect(res.paths).toEqual([['LEFT']]);
  });

  it('expected solution', () => {
    const solver = new Solver(3);
    const res = solver.getAllPaths([
      [0,2,3],
      [1,5,6],
      [4,7,8]
    ]);
    expect(res.pathLength).toEqual(4);
    expect(res.paths).toEqual([['UP', 'UP', 'LEFT', 'LEFT']]);
  });

  it('multiple paths solution', () => {
    expect(true).toBe(true); // todo: is there even a case like this?
  });
});
