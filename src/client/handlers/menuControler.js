
class MenuControler {
  constructor(inputNodeName, listNodeName, selectorsNames, currentValue) {
    this.currentValue = currentValue;
    this.active = false;
    this.$input = document.querySelector(`.${inputNodeName}`);
    this.$list = document.querySelector(`.${listNodeName}`);
    this.animationEnd = true;

    this.$currentName = this.$input.querySelector('.input__field-menu-current');
    this.$currentImg = this.$input.querySelector('.input__field-menu-current-image');

    const meChange = document.createEvent('Event');
    meChange.initEvent('meChange', false, true);

    this.$input.addEventListener('click', () => {
      if (!this.active) {
        selectorsNames.forEach((element) => document.querySelector(`.${element}`)
          .classList.add(`${element}-active`));
      } else {
        selectorsNames.forEach((element) => document.querySelector(`.${element}`)
          .classList.remove(`${element}-active`));
      }
      this.active = !this.active;
    });

    this.$list.addEventListener('click', (ev) => {
      const mPath = [];
      let node = ev.target;
      while (node !== document.body) {
        mPath.push(node);
        node = node.parentNode;
      }

      const target = mPath.find((v) => v instanceof HTMLLIElement);
      if (target) {
        if (this.currentValue.uid !== target.dataset.uid) {
          this.currentValue = {
            uid: target.dataset.uid,
            name: target.querySelector('[data-content]')
              .dataset.content,
            picture: target.querySelector('img')
              .src,
          };

          this.$currentName.classList.add('--selected');
          this.$currentName.innerHTML = this.currentValue.name;
          this.$currentImg.src = this.currentValue.picture;
          setTimeout(() => {
            this.$input.dispatchEvent(meChange);
          }, 1000);
        }

        this.$input.click();
      }
    });
  }
}

export default MenuControler;
