import debounce from './deboune';
import CityCreator from './cityCreator';
import Sender from './sender';

class SearchEngine {
  constructor(parentNodeId, inputId, needCreator = true, clearButton, sessionStore) {
    this.$node = document.querySelector(`#${parentNodeId}`);
    this.$input = document.querySelector(`#${inputId}`);
    this.$clearButton = document.querySelector(`#${clearButton}`);
    this.$divAnimation = this.$node.querySelector('.loading_dots').parentElement;
    this._$active = undefined;
    this.hardUpdate = false;
    this.lastQuery = '';
    this.currentValue = undefined;
    this.sessionStore = sessionStore;
    this.needCreator = needCreator;
    this.defaultPlaceholder = this.$input.getAttribute('placeholder', '');

    this.SENDER = new Sender('/api/city');

    if (this.needCreator) {
      this.cityCreator = new CityCreator(this);
    }

    if (this.sessionStore) {
      this.restoreValue();
    }

    const searchTriggers = [
      'input',
    ];

    const debounceMS = 500;

    const keys = {
      ENTER: 13,
      ARROWDOWN: 40,
      ARROWUP: 38,
      ESCAPE: 27,
    };

    this.event = new CustomEvent('seChange');

    if (this.$clearButton) {
      this.$clearButton.addEventListener('click', () => {
        this.currentValue = undefined;
        this.$input.value = '';
        this.cleanNodes();
        this.$divAnimation.style.display = 'none';
        this.$input.setAttribute('placeholder', this.defaultPlaceholder);
      });
    }

    searchTriggers.forEach((v) => {
      this.$input.addEventListener(v,
        debounce(async () => {
          if (!this.$input.value) {
            this.cleanNodes();
            this.$divAnimation.style.display = 'none';
          } else if (this.$input.value !== this.lastQuery || this.hardUpdate) {
            this.lastQuery = this.$input.value;
            this.hardUpdate = false;
            this._$active = undefined;
            this.cleanNodes();

            const JSON = await this.SENDER.getDataFromServer(undefined, 'GET', `?value=${this.lastQuery}`);
            if (!JSON.errors) {
              this.buildNodes(JSON);
            }
          }
        }, debounceMS));
    });

    ['focusin', 'focusout'].forEach((v) => {
      this.$input.addEventListener(v, (ev) => {
        const IS_WINDOW_ACTIVE = this.cityCreator ? this.cityCreator.isWindowActive() : false;

        switch (ev.type) {
          case ('focusin'):

            this.$node.style.opacity = 1;
            if (this.currentValue && !this.$input.value) {
              this.$input.value = this.currentValue.name;
              this.lastQuery = this.currentValue.name;
            }
            break;

          case ('focusout'):
            if (!this.$input.value || IS_WINDOW_ACTIVE
              || (this.currentValue && this.currentValue.name === this.$input.value)) {
              this.$input.value = '';
              this.$node.style.opacity = 0;
              this.$divAnimation.style.display = 'none';
            } else { this.$input.focus(); }
            break;

          default:
            break;
        }
      });
    });

    const selection = ($curr) => {
      if (($curr instanceof HTMLLIElement && $curr.dataset.uid !== '-1') || $curr === undefined) {
        const obj = $curr ? {
          uid: $curr.dataset.uid,
          name: $curr.dataset.name,
          country: $curr.dataset.country,
        } : {};

        this.newCurrentValue(obj, !$curr);
      } else if ($curr.dataset.uid === '-1') {
        this.cityCreator.openWithNewValue(this.$input.value);
      }

      this.lastQuery = '';
      this.$input.value = '';
      this.$active = undefined;
      this.hardUpdate = true;
      this.cleanNodes();
      this.$input.blur();

      if ($curr !== undefined) {
        if ($curr.dataset.uid !== '-1') {
          this.$input.dispatchEvent(this.event);
        } else if ($curr.dataset.uid === '-1') {
          this.cityCreator.countryFocus();
        }
      }
    };

    this.$input.addEventListener('keydown', (ev) => {
      if (this.$node.hasChildNodes) {
        switch (ev.keyCode) {
          case (keys.ENTER):

            if (this.$active instanceof HTMLLIElement) {
              ev.preventDefault();
              selection(this.$active);
            }
            break;

          case (keys.ESCAPE):

            this.$active = undefined;
            selection(this.$active);
            break;

          case (keys.ARROWDOWN):

            if (this.$active === undefined
              || this.$node.lastElementChild.isEqualNode(this.$active)) {
              [, this.$active] = this.$node.children;
            } else {
              this.$active = this.$active.nextSibling;
            }
            break;

          case (keys.ARROWUP):

            if (this.$active === undefined || this.$active.isEqualNode(this.$node.children[1])) {
              this.$active = this.$node.lastElementChild;
            } else {
              this.$active = this.$active.previousSibling;
            }
            break;

          default:
            break;
        }
      }
    });

    this.$node.addEventListener('click', (ev) => {
      selection(ev.target);
    });
  }

  get $active() { return this._$active; }

  set $active(value) {
    if (this._$active instanceof HTMLLIElement) {
      this._$active.classList.remove('--selected');
    }

    this._$active = value;

    if (this._$active instanceof HTMLLIElement) {
      this._$active.classList.add('--selected');
    } else {
      this._$active = undefined;
    }
  }

  newCurrentValue(nObj, onlyPH) {
    if (!onlyPH) {
      this.currentValue = {
        uid: nObj.uid,
        name: nObj.name,
        country: nObj.country,
      };
    }
    if (this.currentValue) {
      this.$input.setAttribute('placeholder', this.currentValue.name
        + (this.currentValue.country ? `, ${this.currentValue.country}` : ''));
    }

    if (this.sessionStore && this.currentValue) {
      if (!(this.sessionStore.sessionStorageName in sessionStorage)) {
        sessionStorage.setItem(this.sessionStore.sessionStorageName, JSON.stringify([]));
      }
      const CITIES = JSON.parse(sessionStorage.getItem(this.sessionStore.sessionStorageName));
      const CITY = CITIES.find((v) => v.uid === this.currentValue.uid);

      if (!CITY) {
        CITIES.push(this.currentValue);
        sessionStorage.setItem(this.sessionStore.sessionStorageName, JSON.stringify(CITIES));
      }
    }
  }

  async sendRequestToServer() {
    let city;
    const RESPONCE = await this.SENDER.getDataFromServer(undefined, 'GET', `?id=${this.sessionStore.restoreValue}`);

    if (!RESPONCE.errors) {
      if (RESPONCE[0]) {
        [city] = RESPONCE;
        city.uid = city._id.toString();
      }
    }
    return city;
  }

  async restoreValue() {
    if (this.sessionStore.sessionStorageName && this.sessionStore.restoreValue) {
      let cities;
      let city;

      if (this.sessionStore.sessionStorageName in sessionStorage) {
        cities = JSON.parse(sessionStorage.getItem(this.sessionStore.sessionStorageName));
        city = cities.find((v) => v.uid === this.sessionStore.restoreValue);
      }

      if (city === undefined) {
        city = await this.sendRequestToServer();
      }

      if (city) {
        this.newCurrentValue(city, false);
      }
    }
  }

  cleanNodes() {
    this.$divAnimation.style.display = 'block';
    const nodes = this.$node.childNodes;

    for (let i = nodes.length - 1; i !== 0; i -= 1) {
      if (this.$divAnimation !== nodes[i]) {
        this.$node.removeChild(nodes[i]);
      }
    }
  }

  createElement(name, country, uid, cClass) {
    const $elem = document.createElement('li');
    $elem.innerHTML = name + (country ? `, ${country}` : '');
    $elem.dataset.name = name;
    $elem.dataset.country = country;
    $elem.dataset.uid = uid;
    $elem.classList.add(cClass);
    this.$node.appendChild($elem);
  }

  buildNodes(arr) {
    this.$divAnimation.style.display = 'none';

    if (arr.length) {
      arr.forEach((v) => {
        this.createElement(v.name, v.country, v._id, 'se_elem');
      });
    }
    if (this.needCreator) {
      this.createElement('Создать новый город', '', -1, 'create_city');
    }
  }
}

export default SearchEngine;
