import { Tree, TreeNode, BindedProperty, TreeData } from './model/treenode.js';

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
            {
              label: 'file_test_v001.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v002.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v003.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v004.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v005.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v006.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v007.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v008.fbx',
              type: 'file',
              children: []
            },
            {
              label: 'file_test_v009.fbx',
              type: 'file',
              children: []
            },
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
function buildTree(obj) {
  const node = new TreeNode(tree, obj.label, obj.type);

  obj.children.forEach(child => {
    const childNode = buildTree(child);
    childNode.parent.value = node;
  });

  return node;
}

let selectedNodes = new BindedProperty([], val => {
  // document.getElementById('node-label').value = val.map(s => s.label.value);
});

const tree = new Tree('.treeview', selectedNodes);
tree.content.value = buildTree(treeObject);

const treeData = new TreeData('')

// temp area
console.log(tree);
window.TreeNode = TreeNode;
window.tree = tree;
