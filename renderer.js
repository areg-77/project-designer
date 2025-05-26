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

const tree = new Tree(
  buildTree(treeObject)
);
window.tree = tree;

function buildTree(obj) {
  const children = (obj.children || []).map(buildTree);
  return new TreeNode(obj.label, obj.type, children);
}

document.querySelector('.treeview').appendChild(tree.content.element.li);
