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
  constructor(label, type, children = []) {
    this.#generateHTML();

    this.parent = new BindedProperty(null, val => {
      const oldParent = this.parent?._value;
      if (oldParent) {
        oldParent.children.value = oldParent.children.value.filter(child => child !== this);
      }
      if (val) {
        this.tree = val.tree;

        if (!val.children.value.includes(this))
          val.children.push(this);
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
      if (this.tree) {
        this.element.treeNode.dataset.selected = val;

        if (val) {
          if (!this.tree.selectedNodes.includes(this)) this.tree.selectedNodes.push(this);
        }
        else
          this.tree.selectedNodes = this.tree.selectedNodes.filter(i => i !== this);
        
        console.log(this.tree.selectedNodes.map(s => s.label.value));
      }
    });
    this.children = new BindedProperty(children, val => {
      if (val.length > 0) {
        this.element.expanderContainer.classList.remove('hidden');
        this.element.ul.innerHTML = '';

        for (const child of val)
          this.element.ul.appendChild(child.element.li);
      }
      else
        this.element.expanderContainer.classList.add('hidden');
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

    this.element.expanderContainer.addEventListener('click', () => {
      this.expanded.value = !this.expanded.value;
    });

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
  content;
  selectedNodes;

  constructor(content) {
    this.setContent(content);
    this.selectedNodes = [];
  }

  setContent(content) {
    if (content) {
      this.content = content;
      this.content.tree = this;
    }
  }
}
