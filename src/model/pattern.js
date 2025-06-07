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

export function getPattern(array, lock = '*') {
  const left = leftToRight(array, lock);
  const right = rightToLeft(array, lock);

  return left.split('').map((char, i) => char === lock ? right[i] : char).join('');
}
export function getPatternClean(array, lock = '*') {
  return getPattern(array, lock).replace(new RegExp(`\\${lock}+`, 'g'), lock);
}

function applyMaskReplacement(original, mask, template, lock = '*') {
    const extractMaskedParts = (text, mask) => {
        const parts = [];
        let buffer = '';
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === lock) {
                buffer += text[i];
            } else {
                if (buffer) {
                    parts.push(buffer);
                    buffer = '';
                }
            }
        }
        if (buffer) parts.push(buffer);
        return parts;
    };
    const replacements = extractMaskedParts(original, mask);

    let result = '';
    let repIndex = 0;
    for (let i = 0; i < template.length; i++) {
        if (template[i] === lock) {
            result += replacements[repIndex++] ?? '';
        } else {
            result += template[i];
        }
    }

    return result;
}

export function setPattern(array, pattern, lock = '*') {
  const origPattern = getPattern(array, lock);
  return array.map(a => applyMaskReplacement(a, origPattern, pattern));;
}
