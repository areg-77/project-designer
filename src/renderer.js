import { Tree, TreeNode, TreeData } from './model/treenode.js';

const treeObject =  {
  label: 'Project',
  type: 'folder',
  children: [
    {
      label: 'Assets',
      type: 'folder',
      children: [
        {
          label: 'Characters',
          type: 'folder',
          children: [
            {
              label: 'hero',
              type: 'folder',
              children: [
                {
                  label: 'hero.fbx',
                  type: 'file',
                  children: []
                }
              ]
            }
          ]
        },
        {
          label: 'Environment',
          type: 'folder',
          children: [
            {
              label: 'building',
              type: 'folder',
              children: [
                {
                  label: 'building.fbx',
                  type: 'file',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      label: 'Settings',
      type: 'folder',
      children: [
        {
          label: 'graphics.dll',
          type: 'file',
          children: []
        },
        {
          label: 'sfx.dll',
          type: 'file',
          children: []
        },
        {
          label: 'versions-sandbox',
          type: 'folder',
          children: [
            ...Array.from({ length: 5 }, (_, i) => ({
              label: `file_test_v${String(i + 1).padStart(3, '0')}.fbx`,
              type: 'file',
              children: []
            })),
            ...Array.from({ length: 5 }, (_, i) => ({
              label: `file_abcd_v${String(i + 1).padStart(3, '0')}.fbx`,
              type: 'file',
              children: []
            }))
          ]
        }
      ]
    },
    {
      label: 'project.json',
      type: 'file',
      children: []
    }
  ]
}
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
    return nodes[nodes.length - 1]?.path() ?? '../path';
  }),
  new TreeData('name', (nodes) => {
    return nodes[nodes.length - 1]?.label.value ?? '';
  }),
  new TreeData('type', (nodes) => {
    return nodes[nodes.length - 1]?.type.value ?? '';
  })
]);
tree.content.value = buildTree(tree, treeObject);

// temp area
window.TreeNode = TreeNode;
window.tree = tree;
