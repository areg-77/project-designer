class BindedProperty {
  constructor(value, onChange) {
    this._value = value;
    this.onChange = onChange;

    if (this.onChange)
      this.onChange(value);
  }

  get value() {
    return this._value;
  }

  set value(newVal) {
    this._value = newVal;
    if (this.onChange)
      this.onChange(newVal);
  }

  push(...items) {
    if (Array.isArray(this._value)) {
      this._value.push(...items);
      if (this.onChange)
        this.onChange(this._value);
    }
  }
}

// pushes/initializes children and then updates the html
const children = new BindedProperty([], (val) => {
  console.log('update the html: ', val);
});

// modifies the child's tree before adding
function addChild(...nodes) {
  for (let node of nodes) {
    console.log(node.tree, ` -> 'not null'`);
    node.tree = 'not null';
  }
  children.push(...nodes);
}

addChild({tree: null});
addChild({tree: null});

console.log("\nfinal: ", children.value);
