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

const tabs = document.getElementById('tabs');
const tabLabels = document.querySelectorAll('.tab-label');
const tabContents = document.querySelectorAll('.tab-content');
const tabSelected = document.querySelector('.tab-selected');
let activeIndex = 0;

function updateTabs(index) {
  tabLabels.forEach(l => l.classList.remove('active'));
  tabContents.forEach(c => c.classList.remove('active'));

  tabLabels[index].classList.add('active');
  tabContents[index].classList.add('active');
  moveSelected(tabLabels[index]);
}

function moveSelected(label) {
  const x = label.offsetLeft;
  const y = label.offsetTop;
  const w = label.offsetWidth;
  const h = label.offsetHeight;

  const margin = 2;
  tabSelected.style.transform = `translate(${x + margin}px, ${y + margin}px)`;
  tabSelected.style.width = `${w - margin*2}px`;
  tabSelected.style.height = `${h - margin*2}px`;
}

tabLabels.forEach((label, index) => {
  label.addEventListener('click', () => {
    activeIndex = index;
    updateTabs(activeIndex);
  });
});

tabs.addEventListener('wheel', (event) => {
  event.preventDefault();

  if (event.deltaY > 0 && activeIndex < tabLabels.length - 1) {
    activeIndex++;
    updateTabs(activeIndex);
  } else if (event.deltaY < 0 && activeIndex > 0) {
    activeIndex--;
    updateTabs(activeIndex);
  }
  document.activeElement.blur();
}, { passive: false });

moveSelected(tabLabels[activeIndex]);

// temp area
window.TreeNode = TreeNode;
window.tree = tree;
window.buildTree = buildTree;
window.treeObject = treeObject;
window.treeNew = treeNew;
