import { AStarSolverInner, PrecomputeData } from "./astar-solver-inner";

describe('AStarSolverInner', () => {
  let inner: AStarSolverInner;
  let precomputeData: PrecomputeData;

  beforeEach(() => {
    precomputeData = new PrecomputeData(4);
    inner = new AStarSolverInner('', new PrecomputeData(4));
  });

  const getConflicts = (row: string) => {
    return precomputeData.getRowConflictsNaive(0, row, c => 0);
  }

  it('no conflicts', () => {
    expect(getConflicts('1234')).toBe(0);
  });

  it('1 conflict', () => {
    expect(getConflicts('2134')).toBe(1);
    expect(getConflicts('3124')).toBe(1);
  });

  it('2 conflicts', () => {
    expect(getConflicts('3214')).toBe(2);
  });

  it('3 conflicts', () => {
    expect(getConflicts('4321')).toBe(3);
  });
});
