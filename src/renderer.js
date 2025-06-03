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

const nodePath = new TreeData('path', (nodes) => {
  // console.log('hello'); you can do something before showing. (planning o make the dataField have a class of .placeholder when theres no node selected then it will remove that class and show it)
  return nodes[nodes.length - 1]?.path() ?? 'path';
  // whatever you return is what the "field" is going to show
});

const tree = new Tree('tree', [nodePath]);
tree.content.value = buildTree(tree, treeObject);

// temp area
window.TreeNode = TreeNode;
window.tree = tree;
