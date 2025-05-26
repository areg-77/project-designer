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

const tree = new Tree();
window.tree = tree;
window.TreeNode = TreeNode;

const projectNode = new TreeNode('Project', 'folder');
const assetsNode = new TreeNode('Assets', 'folder');
const heroNode = new TreeNode('hero.fbx', 'file');
const buildingNode = new TreeNode('building.fbx', 'file');
const projectFileNode = new TreeNode('project.json', 'file');

assetsNode.children.push(heroNode, buildingNode);
projectNode.children.push(assetsNode, projectFileNode);

tree.setContent(projectNode);

function buildTree(obj) {
  
}

document.querySelector('.treeview').appendChild(tree.content.element.li);
console.log(tree);
