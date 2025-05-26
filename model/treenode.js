class BindedProperty {
  constructor(value, onChange) {
    this._value = value;
    this.onChange = onChange;
  }

  get value() {
    return this._value;
  }

  set value(newVal) {
    this._value = newVal;
    if (this.onChange)
      this.onChange(newVal);
  }
}

export class TreeNode {
  tree;
  element;

  label;
  type;
  expanded;
  selected;
  children;

  constructor(label, type, children = []) {
    this.tree = new BindedProperty(null, val => {
      this.children?.forEach(child => child.tree.value = val);
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
        if (!this.tree.value.selectedNodes.includes(this)) this.tree.value.selectedNodes.push(this);
      }
      else
        this.tree.value.selectedNodes = this.tree.value.selectedNodes.filter(i => i !== this);
      
      console.log(this.tree.value.selectedNodes.map(s => s.label.value));
    });
    this.children = children;

    this.#generateHTML();
  }

  throughChildren(callback) {
    for (const child of this.children) {
      callback(child);
      child.throughChildren(callback);
    }
  }

  #generateHTML() {
    const li = document.createElement('li'), childrenContainer = document.createElement('div'), ul = document.createElement('ul');
    childrenContainer.className = 'children-container';

    this.children.forEach(child => {
      ul.appendChild(child.element.li);
    });
    childrenContainer.appendChild(ul);

    li.innerHTML = `
      <div class="tree-node" data-expanded="${this.expanded.value}" data-selected="${this.selected.value}">
        <div class="expander-container ${this.children.length === 0 ? 'hidden' : ''}">
          <span class="expander"></span>
        </div>
        <div class="label-container">
          <img class="tree-icon" src="./icons/${this.type.value}-icon.svg"/>
          <span class="tree-label">${this.label.value}</span>
        </div>
      </div>
    `.trim();
    li.appendChild(childrenContainer);

    this.element = {
      li,
        treeNode: li.querySelector('.tree-node'),
          expanderContainer: li.querySelector('.expander-container'),
            expander: li.querySelector('.expander'),
        labelContainer: li.querySelector('.label-container'),
          treeIcon: li.querySelector('.tree-icon'),
          treeLabel: li.querySelector('.tree-label'),
        childrenContainer,
          ul
    }

    this.element.expanderContainer.addEventListener('click', () => {
      this.expanded.value = !this.expanded.value;
    });

    this.element.labelContainer.addEventListener('click', () => {
      this.selected.value = !this.selected.value;
    });
  }
}

export class Tree {
  content;
  selectedNodes;

  constructor(content) {
    this.content = content;
    this.content.tree.value = this;
    this.selectedNodes = [];
  }
}
