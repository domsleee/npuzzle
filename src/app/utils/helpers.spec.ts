import { permute } from "./helpers";

describe('helpers', () => {
  it('perms', () => {
    expect(permute('abc', 1)).toEqual(['a', 'b', 'c']);
  });

  it('perms of 2', () => {
    expect(permute('abc', 2).sort()).toEqual(['ab', 'bc', 'ac', 'ba', 'cb', 'ca'].sort());
  })
});
