array = [
  'qeropik_happy_v01.fbx',
  'qeropik_happy_v06.fbx',
  'qeropik_happy_v07.fbx',
  'qeropik_happy_v05.fbx',
  'qeropik_happy_v09.fbx',
  'qeropik_heplyo_v02.fbx',
];
// qeropik_hap*py_v0*.fbx

function leftToRight(array) {
  let str = '';
  for (index = 0; index < array[0].length; index++) {
    if (array.every(a => a[index] == array[0][index]))
      str += array[0][index];
    else {
      str += '*';
    }
  }
  return str;
}
function rightToLeft(array) {
  return leftToRight(array.map(a => a.split('').reverse().join(''))).split('').reverse().join('');
}
function combine(prefix, suffix) {
  // Find max overlap between end of prefix and start of suffix
  let maxOverlap = 0;
  for (let i = 1; i <= Math.min(prefix.length, suffix.length); i++) {
    if (prefix.slice(prefix.length - i) === suffix.slice(0, i)) {
      maxOverlap = i;
    }
  }
  // Merge with overlap removed
  return prefix + suffix.slice(maxOverlap);
}
function removeDuplicateStars(str) {
  return str.replace(/\*+/g, '*');
}

console.log(removeDuplicateStars(combine(leftToRight(array), rightToLeft(array))));