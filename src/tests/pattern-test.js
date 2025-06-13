function leftToRight(array, lock = '*') {
  let str = '';
  const leader = array.reduce((a, b) => b.length > a.length ? b : a, '');
  for (let i = 0; i < leader.length; i++) {
    if (array.every(a => a[i] == leader[i]))
      str += leader[i];
    else
      str += lock;
  }
  return str;
}
function rightToLeft(array, lock = '*') {
  return leftToRight(array.map(a => a.split('').reverse().join('')), lock).split('').reverse().join('');
}

function getPatternFull(array, lock = '*') {
  const left = leftToRight(array, lock);
  const right = rightToLeft(array, lock);

  return left.split('').map((char, i) => char === lock ? right[i] : char).join('');
}
function getPattern(array, lock = '*') {
  return getPatternFull(array, lock).replace(new RegExp(`\\${lock}+`, 'g'), lock);
}

function extractMask(str, mask, lock = '*') {
  const esc = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const parts = mask.split(new RegExp(`(${esc(lock)}+)`, 'g')).filter(s => s !== '');

  const pattern = '^' + parts.map(p =>
    p[0] === lock ? '(.*?)' : esc(p)
  ).join('') + '$';

  const match = str.match(new RegExp(pattern));
  if (!match) return null;

  let groupIndex = 1;
  return parts.reduce((res, p) => {
    if (p[0] === lock) {
      res.push(match[groupIndex] ?? '');
      groupIndex++;
    }
    return res;
  }, []);
}

const combine = (a, b) => a.map((x, i) => x + (b[i] || '')).join('');

function setPattern(array, pattern, lock = '*') {
  const mask = getPatternFull(array, lock);
  return array.map(a => combine(pattern.split(lock), extractMask(a, mask)));
}

const array = [
  'file_abcd.fbx',
  'file_abcd_v002.fbx',
];

const oldStr = "file_abcd.fbx";
const newStr = "bob_abcd_*.fbx";
const mask = getPatternFull(array);

console.log(oldStr);
console.log(mask);
console.log(newStr);

console.log('');

console.log(newStr.split('*'));
const extmask = extractMask(oldStr, mask);
console.log(extmask);

console.log(`\n${combine(newStr.split('*'), extmask)}`);
