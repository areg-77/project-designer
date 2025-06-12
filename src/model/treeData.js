import { BindedProperty } from './bindedProperty.js';

export class TreeData {
  element;
  selectedNodes;
  lock;

  constructor(dataId, getValue, setValue) {
    this.lock = '*';
    const dataValue = document.getElementById(dataId);
    this.element = document.createElement('span');
    this.element.contentEditable = true;
    this.element.spellcheck = false;
    dataValue.appendChild(this.element);

    this.selectedNodes = new BindedProperty([], val => {
      this.element.innerHTML = getValue(val, this.element).replace(/\*/g, `<span class="lock" contenteditable="false">${this.lock}</span>`);
      if ((val.length > 0 && getValue(val, this.element) && typeof setValue === "function"))
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
      if (this.element.hasAttribute('data-readonly') || e.data === this.lock) e.preventDefault();
    });
  }
}