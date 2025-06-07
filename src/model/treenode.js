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

  setSort(sorted, sortFilter) {
    this.sorted = sorted;
    this.sortFilter = sortFilter;
  }

  update() {
    if (Array.isArray(this._value)) {
      if (this.sorted)
        this._value.sort(this.sortFilter);
    }
    if (this.onChange)
      this.onChange(this._value);
  }

  add(item, duplicateFilter) {
    if (Array.isArray(this._value)) {
      if ((typeof duplicateFilter !== 'function') || !this._value.some(existingItem => duplicateFilter(existingItem) === duplicateFilter(item))) {
        this._value.push(item);
        if (this.sorted)
          this._value.sort(this.sortFilter);
        if (this.onChange)
          this.onChange(this._value, item);
      }
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
      queueMicrotask(() => {
        this.parent.value?.children.update();
        this.tree.selectedNodes.update()
      });
    });

    this.type = new BindedProperty(type, val => {
      this.element.treeIcon.className = 'icon';
      this.element.treeIcon.classList.add(val)
    });
    
    this.expanded = new BindedProperty(false, val => {
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
    // todo: in the future move the filter into the Tree so that the user can change the sorting method later
    this.children.setSort(true, (a, b) =>
      (b.type.value === 'folder') - (a.type.value === 'folder') ||
      a.label.value.localeCompare(b.label.value, undefined, { sensitivity: 'base' }))
    
    this.parent = new BindedProperty(null, val => {
      const oldParent = this.parent?._value;
      if (oldParent)
        oldParent.children.delete(this);

      if (val) {
        val.children.add(this, node => node.label.value);
      }
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
          <span class="icon" style="height: 1.2em"></span>
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
          treeIcon: li.querySelector('.icon'),
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
              this.tree.selectedNodes.add(siblings[i], node => node.label.value);
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

        this.tree.selectedNodes.add(this, node => node.label.value);
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

  scrollIntoView(expandParents = true) {
    if (expandParents)
      this.throughParents(p => p.expanded.value = true);
    this.element.li.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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
  selectedNodes;

  constructor(dataId, getValue, setValue) {
    const dataValue = document.getElementById(dataId);
    this.element = document.createElement('span');
    this.element.contentEditable = true;
    this.element.spellcheck = false;
    dataValue.appendChild(this.element);

    this.selectedNodes = new BindedProperty([], val => {
      this.element.textContent = getValue(val, this.element);
      if ((val.length > 0 && typeof setValue === "function"))
        this.element.removeAttribute('data-readonly');
      else
        this.element.setAttribute('data-readonly', '');
    });
    
    this.element.addEventListener('blur', () => {
      this.selectedNodes.update()
      window.getSelection()?.removeAllRanges();
    });
    this.element.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();

        if (setValue)
          setValue(this.selectedNodes.value, this.element);
        this.element.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.element.blur();
      }
    });
    // block input if readonly
    this.element.addEventListener('beforeinput', e => {
      if (this.element.hasAttribute('data-readonly')) e.preventDefault();
    });
  }
}
