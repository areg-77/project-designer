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
