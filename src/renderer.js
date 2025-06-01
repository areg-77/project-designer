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
function buildTree(obj) {
  const node = new TreeNode(tree, obj.label, obj.type);

  obj.children.forEach(child => {
    const childNode = buildTree(child);
    childNode.parent.value = node;
  });

  return node;
}

const dataTemplate = [
  {
    property: 'Name',
    getValue: (nodes) => nodes[nodes.length - 1].label.value,
    setValue: (nodes, value) => nodes[nodes.length - 1].label.value = value
  },
  {
    property: 'Parent',
    getValue: (nodes) => nodes[nodes.length - 1].parent.value?.label.value
  },
  {
    property: 'Path',
    getValue: (nodes) => nodes[nodes.length - 1].path()
  },
  {
    property: 'DOM',
    getValue: (nodes) => nodes[nodes.length - 1].dom()
  }
]

const treeData = new TreeData('.treedata', dataTemplate);
const tree = new Tree('.treeview', treeData);
tree.content.value = buildTree(treeObject);

// temp area
window.TreeNode = TreeNode;
window.tree = tree;
window.treeData = treeData;
