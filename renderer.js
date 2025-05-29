import { Tree, TreeNode } from './model/treenode.js';

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
          label: 'for-mac',
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
            }
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

const tree = new Tree('.treeview');
tree.content.value = buildTree(treeObject);

function buildTree(obj) {
  const node = new TreeNode(tree, obj.label, obj.type);

  obj.children.forEach(child => {
    const childNode = buildTree(child);
    childNode.parent.value = node;
  });

  return node;
}

console.log(tree);
window.TreeNode = TreeNode;
window.tree = tree;