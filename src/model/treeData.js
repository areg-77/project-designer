import { BindedProperty } from './bindedProperty.js';
import { isCursorAtStart, isCursorInsideElement, isCursorBeforeElement, isCursorAfterElement } from './cursorPosition.js';

export class TreeData {
  constructor(dataId, getValue, setValue) {
    this.lock = '*';
    const dataValue = document.getElementById(dataId);
    this.element = document.createElement('span');
    this.element.contentEditable = true;
    this.element.spellcheck = false;
    dataValue.appendChild(this.element);

    this.editable = new BindedProperty(false, val => {
      if (val)
        this.element.removeAttribute('data-readonly');
      else
        this.element.setAttribute('data-readonly', '');
    });

    this.selectedNodes = new BindedProperty([], val => {
      this.element.innerHTML = getValue(val, this.element).replace(/\*/g, `<span class="lock" contenteditable="false">${this.lock}</span>`);
      this.editable.value = (val.length > 0 && getValue(val, this.element) && typeof setValue === "function");
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
      else {
        const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (!arrowKeys.includes(e.key) &&
            ((e.key === 'Backspace' && (isCursorAfterElement('lock') || isCursorAtStart())) || (e.key === 'Delete' && isCursorBeforeElement('lock')) || 
            isCursorInsideElement('lock')))
          e.preventDefault();
      }
    });
    // block input if readonly
    this.element.addEventListener('beforeinput', e => {
      if (!this.editable.value || e.data === this.lock)
        e.preventDefault();
    });
  }
}