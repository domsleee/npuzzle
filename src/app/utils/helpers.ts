
export function getRandomSeed(numChars: number = 10) {
  let res = '';
  for (let i = 0; i < numChars; ++i) {
    res += 'a' + Math.floor(Math.random() * 26);
  }
  return res;
}

export function permute(str: string, n: number): Array<string> {
  // if (str === '') {
  //   throw new Error('??');
  // }
  if (n === 0) return [];
  if (n === 1) return str.split('');
  let res = new Array<string>();
  for (let i = 0; i < str.length; ++i) {
    const perms = permute(str.substring(0, i) + str.substring(i+1), n-1);
    const myPerms = perms.map(t => str[i] + t);
    res = res.concat(myPerms);
  }
  return res;
}