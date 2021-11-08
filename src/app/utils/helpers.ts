
export function getRandomSeed(numChars: number = 10) {
  let res = '';
  for (let i = 0; i < numChars; ++i) {
    res += 'a' + Math.floor(Math.random() * 26);
  }
  return res;
}
