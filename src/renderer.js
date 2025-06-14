import { Tree, TreeNode, TreeData, getPattern, setPattern } from './model/index.js';

function buildTree(tree, obj) {
  const node = new TreeNode(tree, obj.label, obj.type);

  obj.children.forEach(child => {
    const childNode = buildTree(tree, child);
    childNode.parent.value = node;
  });

  return node;
}

const tree = new Tree('tree', [
  new TreeData('path', (nodes, elem) => {
    elem.style = `
      color: var(--foreground-dark);
      direction: rtl;
      text-align: left;
      text-overflow: ellipsis;
    `;
    
    if (nodes.length > 1)
      return `&lrm;../${getPattern(nodes.map(n => n.label.value))}<span class="tag" contentEditable="false" style="margin-left: 0.5em;">${nodes.length}</span>&lrm;`;
    return '&lrm;' + (nodes[nodes.length - 1]?.path() ?? '../path');
  }),
  new TreeData('name',
    (nodes) => {
      return getPattern(nodes.map(n => n.label.value));
    },
    (nodes, elem) => {
      if (elem.textContent) {
        let labels = nodes.map(n => n.label.value);
        labels = setPattern(labels, elem.textContent);
        nodes.forEach((node, i) => node.label.value = labels[i]);

        queueMicrotask(() => {
          nodes.forEach(n => n.scrollIntoView());
          nodes.reverse().forEach(n => n.scrollIntoView());
        });
      }
    }
  ),
  new TreeData('type', (nodes) => {
    return nodes[nodes.length - 1]?.type.value ?? '';
  }),
  new TreeData('dom', (nodes) => {
    return nodes[nodes.length - 1]?.dom() ?? '';
  })
]);

const treeObject = await window.electronAPI.readProject('D:/_ELECTRON/_PROJECTDESIGNER/Project');
tree.content.value = buildTree(tree, treeObject);
const treeNew = await window.electronAPI.readProject('D:/_ELECTRON/_PROJECTDESIGNER/project-designer/screenshots');
// tree.content.value = buildTree(tree, treeNew);
// requestAnimationFrame(() => tree.content.value.throughChildrens(c => c.expanded.value = false));

// temp area
window.TreeNode = TreeNode;
window.tree = tree;
window.buildTree = buildTree;
window.treeObject = treeObject;
window.treeNew = treeNew;
