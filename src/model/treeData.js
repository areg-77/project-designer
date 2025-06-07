import { BindedProperty } from './bindedProperty.js';

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