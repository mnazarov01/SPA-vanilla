import { $wrapperSuccess, $error, $wrapperError } from './utils/modalWindows';

class Sender {
  constructor(apiURL, $loadingWrapper, $wrapperBlur, $dataElement, components) {
    this.$loadingWrapper = $loadingWrapper;
    this.$wrapper = $wrapperBlur;
    this.$data = $dataElement;
    this.components = components;
    this.apiURL = apiURL;
  }

  switchLoadingDisplay(on) {
    if (on) {
      if (this.$loadingWrapper) {
        this.$loadingWrapper.style.display = 'flex';
      }

      if (this.$wrapper) {
        this.$wrapper.style.filter = 'blur(5px)';
      }
    } else {
      if (this.$loadingWrapper) {
        this.$loadingWrapper.style.display = 'none';
      }
      if (this.$wrapper) {
        this.$wrapper.style.filter = 'none';
      }
    }
  }

  getCurrentData() {
    const obj = {};
    Object.keys(this.components).forEach((v) => obj[v] = this.components[v].value);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    obj.deliveryToday = obj.date.getTime() === now.getTime();

    return obj;
  }

  async getDataFromServer(components = undefined, method = 'POST', parameters = '') {
    try {
      const INIT = {
        method,
        headers: { 'Content-type': 'application/json' },
      };

      if (INIT.method === 'POST') {
        INIT.body = components ? JSON.stringify(components) : JSON.stringify(this.getCurrentData());
      }

      const response = await fetch(this.apiURL + parameters, INIT);
      const json = await response.json();

      if (json.error) {
        throw json.error;
      }

      this.switchLoadingDisplay(false);

      if (this.$data) {
        this.$data.innerHTML = json;
      }
      return json;
    } catch (err) {
      this.switchLoadingDisplay(false);

      console.error(err);

      setTimeout(() => {
        $error.innerText = err;
        $wrapperError.classList.add('active');
      }, $wrapperError.classList.contains('active') ? 300 : 0);

      $wrapperSuccess.classList.remove('active');
      $wrapperError.classList.remove('active');

      return { errors: err };
    }
  }
}

export default Sender;
