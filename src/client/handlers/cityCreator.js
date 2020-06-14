import Sender from './sender';
import { $success, $wrapperSuccess, $wrapperError } from './utils/modalWindows';

class CityCreator {
  constructor(seEngine = undefined) {
    this.newCitySubmit = document.querySelector('.input_city-button');
    this.inputNewCity = document.querySelector('#input_city_create-name');
    this.inputNewCityCountry = document.querySelector('#input_city_create-country');
    this.newCityClose = document.querySelector('.city_creator-close');
    this.wrapperCityCreator = document.querySelector('#wrapper_city_creator');
    this.cityCloser = document.querySelector('.city_creator-close');
    this.loadingDots = this.wrapperCityCreator.querySelector('.loading_dots');
    this.underWrapperCityCreator = this.wrapperCityCreator.querySelector('#city_creator');

    this.wrapperCityCreator.style.position = 'fixed';

    this.seEngine = seEngine;

    const sender = new Sender('/api/create-city', this.loadingDots, this.underWrapperCityCreator, undefined);

    const eventCreatedNewCity = new CustomEvent('created-new-city');

    const submit = async (ev) => {
      ev.preventDefault();

      if (!this.currentTarget) {
        return;
      }

      sender.switchLoadingDisplay(true);
      const res = await sender.getDataFromServer({
        name: this.inputNewCity.value,
        country: this.inputNewCityCountry.value,
      });

      if (!res.errors) {
        if (this.seEngine) {
          this.seEngine.newCurrentValue({
            uid: res._id,
            name: res.name,
            country: res.country,
          });

          seEngine.$input.dispatchEvent(seEngine.event);
          this.newCityClose.click();
        } else {
          window.dispatchEvent(eventCreatedNewCity);
          this.inputNewCity.value = '';
          this.inputNewCityCountry.value = '';
          this.inputNewCity.focus();
        }

        setTimeout(() => {
          $success.innerText = `Город создан: ${res.name}, ${res.country}`;
          $wrapperSuccess.classList.add('active');

          setTimeout(() => $wrapperSuccess.classList.remove('active'), 2000);
        }, $wrapperSuccess.classList.contains('active') ? 300 : 0);

        $wrapperSuccess.classList.remove('active');
        $wrapperError.classList.remove('active');
      }
    };

    const close = () => {
      this.wrapperCityCreator.classList.remove('on');
      this.currentTarget = false;
    };

    this.newCityClose.addEventListener('click', close);
    this.newCitySubmit.addEventListener('click', submit);
  }

  openWithNewValue(value, isAbsolute = true, closer = true) {
    this.wrapperCityCreator.style.position = isAbsolute ? 'fixed' : 'relative';
    this.cityCloser.style.display = closer ? 'block' : 'none';

    this.wrapperCityCreator.classList.add('on');

    this.inputNewCity.value = '';
    this.inputNewCityCountry.value = '';
    this.inputNewCity.value = value;
    this.currentTarget = true;
  }

  countryFocus() {
    this.inputNewCityCountry.focus();
  }

  isWindowActive() {
    return this.wrapperCityCreator.classList.contains('on');
  }
}

export default CityCreator;
