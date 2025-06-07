import { Tree, TreeNode, TreeData } from './model/treenode.js';

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
    // if (nodes[nodes.length - 1]) {
    //   elem.classList.remove('placeholder');
    //   return nodes[nodes.length - 1]?.path();
    // }
    // else {
    //   elem.classList.add('placeholder');
    //   return '../path';
    // }
    requestAnimationFrame(() => {
      elem.scrollLeft = elem.scrollWidth;
    });
    return nodes[nodes.length - 1]?.path() ?? '../path';
  }),
  new TreeData('name',
    (nodes) => {
      return nodes[nodes.length - 1]?.label.value ?? '';
    },
    (nodes, elem) => {
      nodes[nodes.length - 1].label.value = elem.innerText;
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

// temp area
window.TreeNode = TreeNode;
window.tree = tree;
