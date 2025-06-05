export class BindedProperty {
  constructor(value, onChange) {
    this.onChange = onChange;
    if (this.onChange)
      this.onChange(value);
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(newVal) {
    if (this.onChange)
      this.onChange(newVal);
    this._value = newVal;
  }

  update() {
    if (this.onChange)
      this.onChange(this._value);
  }

  add(item) {
    if (Array.isArray(this._value)) {
      this._value.push(item);
      if (this.onChange)
        this.onChange(this._value, item);
    }
  }

  addD(item) {
    if (Array.isArray(this._value)) {
      if (!this._value.includes(item))
        this.add(item);
    }
  }

  delete(item) {
    if (Array.isArray(this._value)) {
      this._value = this._value.filter(val => val !== item);
      if (this.onChange)
        this.onChange(this._value, item);
    }
  }

  clear(excludeItem) {
    if (Array.isArray(this._value)) {
      [...this._value].forEach(val => {
        if (val !== excludeItem)
          this.delete(val);
      });
    }
  }
}

const iconPath = {
  file: 'M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h287q16 0 30.5 6t25.5 17l194 194q11 11 17 25.5t6 30.5v447q0 33-23.5 56.5T720-80H240Zm280-560q0 17 11.5 28.5T560-600h160L520-800v160Z',
  folder: 'M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z'
}

export class TreeNode {
  tree;
  element;

  parent;
  label;
  type;
  expanded;
  selected;
  children;

  // initializing the node
  constructor(tree, label, type) {
    this.tree = tree;
    this.#generateHTML();

    this.label = new BindedProperty(label, val => {
      this.element.treeLabel.textContent = val;
      queueMicrotask(() => this.tree.selectedNodes.update());
    });

    this.type = new BindedProperty(type, val => {
      this.element.treeIcon.setAttribute('d', iconPath[val]);
    });
    
    this.expanded = new BindedProperty(true, val => {
      this.element.treeNode.dataset.expanded = val;
    });

    this.selected = new BindedProperty(false, val => {
      this.element.treeNode.dataset.selected = val;
    });

    this.children = new BindedProperty([], val => {
      if (val.length > 0) {
        this.expanded.value = true;
        this.element.expanderContainer.classList.remove('hidden');
        this.element.ul.innerHTML = '';

        // adding each node to html
        val.forEach(child => {
          this.element.ul.appendChild(child.element.li);
        });
      }
      else {
        this.expanded.value = false;
        this.element.expanderContainer.classList.add('hidden');
        this.element.ul.innerHTML = '';
      }
    });
    
    this.parent = new BindedProperty(null, val => {
      const oldParent = this.parent?._value;
      if (oldParent)
        oldParent.children.delete(this);

      if (val)
        val.children.addD(this);
      // else if (oldParent)
      //   this.element.li.remove();
    });
  }

  #generateHTML() {
    const li = document.createElement('li')

    li.innerHTML = `
      <div class="tree-node">
        <div class="expander-container">
          <span class="expander"></span>
        </div>
        <div class="label-container">
          <svg class="tree-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
            <path/>
          </svg>
          <span class="tree-label"></span>
        </div>
      </div>
      <div class="children-container">
        <ul></ul>
      </div>
    `.trim();

    this.element = {
      li,
        treeNode: li.querySelector('.tree-node'),
          expanderContainer: li.querySelector('.expander-container'),
            expander: li.querySelector('.expander'),
        labelContainer: li.querySelector('.label-container'),
          treeIcon: li.querySelector('.tree-icon path'),
          treeLabel: li.querySelector('.tree-label'),
        childrenContainer: li.querySelector('.children-container'),
          ul: li.querySelector('.children-container ul')
    }

    // listener for expanding/collapsing
    this.element.expanderContainer.addEventListener('click', () => {
      this.expanded.value = !this.expanded.value;
    });

    // listener for selecting/deselecting
    this.element.labelContainer.addEventListener('click', () => {
      if (!(this.tree.ctrlCmdPressed || this.tree.shiftPressed))
        this.tree.selectedNodes.clear(this.tree.selectedNodes.value.length > 1 ? null : this);
      const select = !this.selected.value;

      if (this.tree.shiftPressed && this.parent.value) {
        const siblings = this.parent.value.children.value;
        const beginIndex = siblings.indexOf(this.tree.lastSelectedItem);
        const endIndex = siblings.indexOf(this);

        if (beginIndex !== -1 && endIndex !== -1) {
          const [start, stop] = beginIndex < endIndex ? [beginIndex, endIndex] : [endIndex, beginIndex];
          for (let i = start; i <= stop; i++) {
            if (select)
              this.tree.selectedNodes.addD(siblings[i]);
            else
              this.tree.selectedNodes.delete(siblings[i]);
          }
        }
        else
          this.tree.selectedNodes.clear();
      }

      if (select) {
        this.throughParents(par => {
          if (par.selected.value)
            this.tree.selectedNodes.delete(par);
        });
        this.throughChildrens(child => {
          if (child.selected.value)
            this.tree.selectedNodes.delete(child);
        });

        this.tree.selectedNodes.addD(this);
      }
      else
        this.tree.selectedNodes.delete(this);
    });
  }

  parents() {
    const allParents = [];
    let currentNode = this.parent.value;
    while (currentNode) {
      allParents.push(currentNode);
      currentNode = currentNode.parent.value;
    }
    return allParents;
  }
  childrens() {
    const allChildren = [];
    function collectChildren(node) {
      for (const child of node.children.value) {
        allChildren.push(child);
        collectChildren(child);
      }
    }
    collectChildren(this);
    return allChildren;
  }

  throughParents(callback) {
    let currentNode = this.parent.value;
    while (currentNode) {
      callback(currentNode);
      currentNode = currentNode.parent.value;
    }
  }
  throughChildrens(callback) {
    for (const child of this.children.value) {
      callback(child);
      child.throughChildrens(callback);
    }
  }

  path = () => `${this.parent.value?.path() ?? '..'}/${this.label.value}`;
  dom = () => this.parent.value ? `${this.parent.value.dom()}.children.value[${this.parent.value.children.value.indexOf(this)}]` : 'tree.content.value';
}

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
    this.element.setAttribute('tabindex', '0');
    
    // listener for holding ctrl/command or shift
    this.element.addEventListener('keydown', (e) => {
      this.ctrlCmdPressed = e.ctrlKey || e.metaKey;
      this.shiftPressed = e.shiftKey;
    });
    this.element.addEventListener('keyup', (e) => {
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

export class TreeData {
  element;

  constructor(dataId, getValue) {
    const dataValue = document.getElementById(dataId);
    const span = document.createElement('span');
    span.contentEditable = true;
    span.spellcheck = false;
    dataValue.appendChild(span);
    this.element = span ;

    this.selectedNodes = new BindedProperty([], val => {
      this.element.innerHTML = getValue(val, this.element);
    });
  }
}
