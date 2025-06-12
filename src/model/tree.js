import { BindedProperty } from './bindedProperty.js';

export class Tree {
  element;
  content;

  selectedNodes;
  lastSelectedItem

  ctrlCmdPressed;
  shiftPressed;

  // initializing the tree
  constructor(treeId, datas) {
    this.element = document.getElementById(treeId);
    
    // listener for holding ctrl/command or shift
    document.addEventListener('keydown', (e) => {
      this.ctrlCmdPressed = e.ctrlKey || e.metaKey;
      this.shiftPressed = e.shiftKey;
    });
    document.addEventListener('keyup', (e) => {
      this.ctrlCmdPressed = e.ctrlKey || e.metaKey;
      this.shiftPressed = e.shiftKey;
    });
    this.element.addEventListener('blur', () => {
      this.ctrlCmdPressed = false;
      this.shiftPressed = false;
    });

    // deselecting once clicked away
    this.element.addEventListener('click', (e) => {
      if (!(this.ctrlCmdPressed || this.shiftPressed)) {
        const clickedNode = e.target.closest('.tree-node');

        if (!clickedNode)
          this.selectedNodes.clear(null);
      }
    });

    this.lastSelectedItem = null;
    this.selectedNodes = new BindedProperty([], (val, item) => {
      if (item) {
        // selecting the node if its in the selectedNodes
        item.selected.value = val.includes(item);
        this.lastSelectedItem = item;
      }
      // sending to data
      datas?.forEach(d => d.selectedNodes.value = val);
    });

    // content (first TreeNode)
    this.content = new BindedProperty(null, val => {
      if (val) {
        while (this.element.firstChild)
          this.element.removeChild(this.element.firstChild);
        this.element.appendChild(val.element.li);
      }
    });
  }
}
