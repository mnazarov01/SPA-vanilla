import urlParser from './utils/urlParser';

const SORTS_TYPES = new Set(['cd-desc', 'cd-asc', 'sum-desc', 'sum-asc']);

class Sorter {
  constructor(nodeId, mainLabelId, mainInputId) {
    this.$node = document.querySelector(`#${nodeId}`);
    this.$label = document.querySelector(`#${mainLabelId}`);
    this.$mainInput = document.querySelector(`#${mainInputId}`);

    this.$inputs = [...this.$node.querySelectorAll('.sorter_radio')];

    const KEYS = {
      TAB: 9,
    };

    this.$node.addEventListener('keydown', (ev) => {
      switch (ev.keyCode) {
        case (KEYS.TAB):
          this.$mainInput.checked = !this.$mainInput.checked;
          break;
        default:
      }
    });

    this.$node.addEventListener('focusout', (ev) => {
      if (![this.$mainInput, ...this.$inputs].find((v) => v === ev.relatedTarget)) {
        this.$mainInput.checked = false;
      }
    });

    const SORT = urlParser.getParam('sort');
    const TARGET = SORTS_TYPES.has(SORT) ? SORT : SORTS_TYPES.values().next().value;

    this.select(this.$inputs.find((v) => v.value === TARGET));

    this.$inputs.forEach((v) => {
      v.addEventListener('click', (ev) => {
        this.select(ev.target);
      });
    });
  }

  select(target) {
    this.target = target;
    this.target.checked = true;
    this.$label.textContent = this.target.nextElementSibling.textContent;
  }
}

export { Sorter, SORTS_TYPES };
