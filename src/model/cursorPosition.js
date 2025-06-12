function isMatchingClass(node, className) {
  return node?.nodeType === 1 && node.classList.contains(className);
}

export function isCursorBeforeElement(className) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  if (!range.collapsed) return false;

  const node = range.startContainer;
  const offset = range.startOffset;

  if (node.nodeType === Node.TEXT_NODE) {
    if (offset === node.nodeValue.length && isMatchingClass(node.nextSibling, className)) {
      return true;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const next = node.childNodes[offset];
    if (isMatchingClass(next, className)) return true;
  }

  return false;
}

export function isCursorAfterElement(className) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  if (!range.collapsed) return false;

  const node = range.startContainer;
  const offset = range.startOffset;

  if (node.nodeType === Node.TEXT_NODE) {
    if (offset === 0 && isMatchingClass(node.previousSibling, className)) {
      return true;
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const prev = node.childNodes[offset - 1];
    if (isMatchingClass(prev, className)) return true;
  }

  return false;
}

export function isCursorInsideElement(className) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const walker = document.createTreeWalker(
    container.nodeType === 1 ? container : container.parentNode,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        return isMatchingClass(node, className) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    if (range.intersectsNode(node)) {
      return true;
    }
  }

  return false;
}

export function isCursorAtStart() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  if (!range.collapsed) return false;

  const container = range.startContainer;
  const offset = range.startOffset;

  let node = container;
  let position = offset;

  if (node.nodeType === Node.TEXT_NODE) {
    if (position !== 0) return false;

    let parent = node.parentNode;
    while (parent && !parent.contentEditable) {
      if (parent.previousSibling) return false;
      parent = parent.parentNode;
    }

    return !node.previousSibling;
  }

  return position === 0;
}
