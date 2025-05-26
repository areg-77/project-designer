class BindedProperty {
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

  push(...items) {
    if (Array.isArray(this._value)) {
      this._value.push(...items);
      if (this.onChange)
        this.onChange(this._value);
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

    this.children = new BindedProperty([], val => {
      if (val.length > 0) {
        this.element.expanderContainer.classList.remove('hidden');
        this.element.ul.innerHTML = '';

        val.forEach(child => {
          this.element.ul.appendChild(child.element.li);
        });
      }
      else
        this.element.expanderContainer.classList.add('hidden');
    });
    
    this.parent = new BindedProperty(null, val => {
      const oldParent = this.parent?._value;
      if (oldParent) {
        oldParent.children.value = oldParent.children.value.filter(child => child !== this);
      }
      if (val) {
        if (!val.children.value.includes(this))
          val.children.push(this);
      }
      else {
        this.element.li.remove();
      }
    });
    
    this.label = new BindedProperty(label, val => {
      this.element.treeLabel.textContent = val;
    });

    this.type = new BindedProperty(type, val => {
      this.element.treeIcon.src = `./icons/${val}-icon.svg`;
    });

    this.expanded = new BindedProperty(false, val => {
      this.element.treeNode.dataset.expanded = val;
    });

    this.selected = new BindedProperty(false, val => {
      this.element.treeNode.dataset.selected = val;

      if (val) {
        if (!this.tree.selectedNodes.includes(this)) this.tree.selectedNodes.push(this);
      }
      else
        this.tree.selectedNodes = this.tree.selectedNodes.filter(i => i !== this);
      
      if (this.selected)
        console.log(this.tree.selectedNodes.map(s => s.label.value));
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
          <img class="tree-icon"/>
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
          treeIcon: li.querySelector('.tree-icon'),
          treeLabel: li.querySelector('.tree-label'),
        childrenContainer: li.querySelector('.children-container'),
          ul: li.querySelector('.children-container ul')
    }

    // setting up a listener for clicking on the expander for expanding/collapsing
    this.element.expanderContainer.addEventListener('click', () => {
      this.expanded.value = !this.expanded.value;
    });

    // setting up a listener for clicking on the node for selecting/deselecting
    this.element.labelContainer.addEventListener('click', () => {
      this.selected.value = !this.selected.value;
    });
  }

  // method for applying an action on each child
  throughChildren(callback) {
    for (const child of this.children.value) {
      callback(child);
      child.throughChildren(callback);
    }
  }
}

export class Tree {
  selectedNodes;
  content;

  constructor(content) {
    this.selectedNodes = [];
    this.content = content;
  }
}
