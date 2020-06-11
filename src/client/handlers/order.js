import MenuControler from './menuControler';
import SearchEngine from './searchEngine';
import debounce from './deboune';
import Sender from './sender';
import { ORDER_TYPES } from './utils/ordersType';
import { $success, $wrapperSuccess, $wrapperError } from './utils/modalWindows';

export default () => {
  const API_CALC = '/api/calculator';
  const API_ORDER_CREATOR = '/api/order-creator';

  const menuControler = new MenuControler('input__field-menu', 'input__label-content-menu', [
    'input__order-type', 'input__field-menu-current', 'input__label-content-menu',
  ], { uid: 1, name: 'Обычный' });

  const seInputFrom = new SearchEngine('input-from-search', 'input-from');
  const seInputTo = new SearchEngine('input-to-search', 'input-to');

  const $dataCalculate = document.querySelector('#data-calculate');
  const $orderMainWrapper = document.querySelector('.order_main_wrapper');

  const $loadingWrapperCreateOrder = document.querySelector('#loading_wrapper_create-order');
  const $loadingWrapperCalculator = document.querySelector('#loading_wrapper_calculator');

  const $orderSubmit = document.querySelector('.order__submit');

  const templateMask = {
    mask: Number,
    scale: 0,
    signed: false,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextTimeWeek = new Date(today).setDate(today.getDate() + 7);
  const nextWeek = new Date(nextTimeWeek);
  const day = nextWeek.getDay();
  const monday = new Date(nextWeek.getFullYear(), nextWeek.getMonth(),
    nextWeek.getDate() + (day === 0 ? -6 : 1) - day);

  const iWeight = IMask(document.querySelector('#input-weight'), templateMask);
  const iVolume = IMask(document.querySelector('#input-volume'), { ...templateMask, radix: '.', scale: 2 });
  const iBox = IMask(document.querySelector('#input-box'), templateMask);
  const iFilm = IMask(document.querySelector('#input-film'), templateMask);
  const iBag = IMask(document.querySelector('#input-bag'), templateMask);
  const fDate = flatpickr(document.querySelector('#input-date'), {
    locale: 'ru',
    dateFormat: 'd.m.Y',
    minDate: today,
    maxDate: today.fp_incr(14),
    disable: [
      (date) => (date.getDay() === 0 || date.getDay() === 6),
    ],
    defaultDate: (today.getDay() === 0 || today.getDay() === 6 ? monday : today),
  });

  const components = (new function () {
    const $calc = document.querySelector('.calculate');
    const $dataErrors = document.querySelector('#data-calculate');
    const $errorsMain = document.querySelector('.calculate-info');
    const $errorsTitle = document.querySelector('.calculate-header');

    $errorsTitle.addEventListener('click', () => {
      if (window.innerWidth <= 880) {
        if (!$calc.classList.toggle('active')) {
          document.querySelector('.calculate').scrollTo(0, 0);
        }
      }
    });

    const $packiging = document.querySelector('.input__packaging');
    const senderCalculator = new Sender(API_CALC, $loadingWrapperCalculator,
      $dataCalculate,
      $dataCalculate,
      this);

    const debounceSenderCalculator = debounce.call(senderCalculator,
      senderCalculator.getDataFromServer,
      1500);

    const animateFail = ($elem, needAnimateColor = true) => {
      const animateClass = 'fail-animate';
      if (!$elem.classList.contains(animateClass)) {
        const listener = (ev) => {
          ev.target.classList.toggle(animateClass);
          ev.target.removeEventListener('animationend', listener);
        };
        $elem.addEventListener('animationend', listener);
        $elem.classList.toggle(animateClass);
        if (needAnimateColor) {
          $elem.classList.add('fail-animate-color');
        }
      }
    };

    const errorsSet = new Set();
    const errors = {
      emptyValueCityFrom: {
        error: 'не указан город отправки',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.emptyValueCityFrom.error;
          if (this.city_from.value === -1) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }

          return { $elem: this.city_from.$elem, needAnimate };
        },
      },
      emptyValueCityTo: {
        error: 'не указан город получения',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.emptyValueCityTo.error;
          if (this.city_to.value === -1) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }

          return { $elem: this.city_to.$elem, needAnimate };
        },
      },
      emptyValueWeight: {
        error: 'не указан вес',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.emptyValueWeight.error;
          if (this.weight.value <= 0) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.weight.$elem, needAnimate };
        },
      },
      emptyValueVolume: {
        error: 'не указан объем',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.emptyValueVolume.error;
          if (this.volume.value <= 0) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.volume.$elem, needAnimate };
        },
      },
      emptyValueDate: {
        error: 'не указана дата груза',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.emptyValueDate.error;
          if (!this.date.value.getTime()) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.date.$elem, needAnimate };
        },
      },

      sameCities: {
        error: 'для авиа нельзя выбрать перевозку внутри одного города',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.sameCities.error;
          if (this.type.value === String(ORDER_TYPES.avia)
            && this.city_from.value === this.city_to.value
            && this.city_from.value !== -1 && this.city_to.value !== -1) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return [{ $elem: this.city_from.$elem, needAnimate },
            { $elem: this.city_to.$elem, needAnimate }];
        },
      },

      deliveryToday: {
        error: 'для авиа нельзя выбрать сегодняшний день',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.deliveryToday.error;

          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (this.type.value === String(ORDER_TYPES.avia)
            && this.date.value.getTime() === now.getTime()) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.date.$elem, needAnimate };
        },
      },

      dateLessCurrentDate: {
        error: 'нельзя указать дату меньше текущей!',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.dateLessCurrentDate.error;

          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (this.date.value.getTime() < now.getTime()) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.date.$elem, needAnimate };
        },
      },

      weightMore100: {
        error: 'авиа перевозки - вес не может быть более 100кг',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.weightMore100.error;

          if (this.type.value === String(ORDER_TYPES.avia) && this.weight.value > 100) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.weight.$elem, needAnimate };
        },
      },

      weightMore2000: {
        error: 'для данного вида перевозки - вес не может быть более 2000кг',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.weightMore2000.error;

          if (this.type.value !== String(ORDER_TYPES.avia) && this.weight.value > 2000) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.weight.$elem, needAnimate };
        },
      },

      volumeMore1: {
        error: 'авиа перевозки - объем не может быть более 1 куб.м',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.volumeMore1.error;

          if (this.type.value === String(ORDER_TYPES.avia) && this.volume.value > 1) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.volume.$elem, needAnimate };
        },
      },

      volumeMore10: {
        error: 'для данного вида перевозки - объем не может быть более 10 куб.м',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.volumeMore10.error;

          if (this.type.value !== String(ORDER_TYPES.avia) && this.volume.value > 10) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.volume.$elem, needAnimate };
        },
      },

      bagAndBoxSelected: {
        error: 'нельзя одновременно выбрать коробку и мешок',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.bagAndBoxSelected.error;

          if (this.type.value !== String(ORDER_TYPES.avia)
            && this.bag.value && this.box.value) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }

          return [{ $elem: this.bag.$elem, needAnimate },
            { $elem: this.box.$elem, needAnimate }];
        },
      },

      bagsMore8: {
        error: 'мешков можно выбрать до 8 штук за один заказ',
        lim: () => {
          let needAnimate = false;
          const ERROR = errors.bagsMore8.error;

          if (this.type.value !== String(ORDER_TYPES.avia) && this.bag.value > 8) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: this.bag.$elem, needAnimate };
        },
      },

      onlyBox: {
        error: 'для авиа можно выбрать только коробку',
        lim: () => {
          const ERROR = errors.onlyBox.error;

          const res = [{ $elem: this.film.$elem, needAnimate: false },
            { $elem: this.bag.$elem, needAnimate: false }];

          if (this.type.value === String(ORDER_TYPES.avia)) {
            if (this.film.value || this.bag.value) {
              errorsSet.add(ERROR);

              if (this.film.value) {
                res[0].needAnimate = true;
              }

              if (this.bag.value) {
                res[1].needAnimate = true;
              }
            } else {
              errorsSet.delete(ERROR);
            }
          } else {
            errorsSet.delete(ERROR);
          }
          return res;
        },
      },

      needPackaging: {
        error: 'необходимо указать упаковку',
        lim: (checkEmpty) => {
          let needAnimate = false;
          const ERROR = errors.needPackaging.error;
          if (checkEmpty
            && Number(this.box.value) === 0
            && Number(this.film.value) === 0
            && Number(this.bag.value) === 0) {
            errorsSet.add(ERROR);
            needAnimate = true;
          } else {
            errorsSet.delete(ERROR);
          }
          return { $elem: $packiging, needAnimate };
        },
      },
    };

    const errorInformaion = () => {
      if (errorsSet.size === 0) {
        return;
      }
      senderCalculator.switchLoadingDisplay(false);
      debounceSenderCalculator(undefined, true);
      $dataErrors.innerHTML = '<li>Детали расчета</li>'.concat([...errorsSet].reduce((acc, v) => acc += `<li>${v}</li>`, ''));
    };

    const runAnimation = (elems) => {
      let needAnimateBlock = false;
      elems.forEach((v) => {
        if (v.needAnimate) {
          needAnimateBlock = true;
          animateFail(v.$elem);
        } else {
          v.$elem.classList.remove('fail-animate-color');
          v.$elem.classList.remove('fail-animate');
        }
      });

      if (needAnimateBlock) {
        animateFail(window.innerWidth > 880 ? $errorsMain : $errorsTitle, false);
      }
      errorInformaion();
    };

    const getAllChecks = (checkEmpty) => Object.keys(this)
      .filter((v) => v !== 'type')
      .reduce((acc, v) => acc.concat(this[v].lim(checkEmpty)), [])
      .sort((a, b) => a.needAnimate - b.needAnimate);

    this.type = {
      $elem: document.querySelector('.input__order-type'),
      get value() {
        return menuControler.currentValue ? menuControler.currentValue.uid : -1;
      },
      event: 'meChange',
      lim() {
        return getAllChecks(false);
      },
    };
    this.city_from = {
      type: String,
      $elem: document.querySelector('.input__field-search-from-wrapper'),
      get value() {
        return seInputFrom.currentValue ? seInputFrom.currentValue.uid : -1;
      },
      event: 'seChange',
      lim(checkEmpty) {
        const targetErrors = [errors.sameCities];
        if (checkEmpty) {
          targetErrors.push(errors.emptyValueCityFrom);
        }
        return targetErrors.reduce((acc, v) => acc.concat(v.lim()), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.city_to = {
      type: String,
      $elem: document.querySelector('.input__field-search-to-wrapper'),
      get value() {
        return seInputTo.currentValue ? seInputTo.currentValue.uid : -1;
      },
      event: 'seChange',
      lim(checkEmpty) {
        const targetErrors = [errors.sameCities];
        if (checkEmpty) {
          targetErrors.push(errors.emptyValueCityTo);
        }
        return targetErrors.reduce((acc, v) => acc.concat(v.lim()), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.weight = {
      type: Number,
      $elem: document.querySelector('.input__field-weight-wrapper'),
      get value() {
        return iWeight.value;
      },
      event: 'change',
      lim(checkEmpty) {
        const targetErrors = [errors.weightMore100, errors.weightMore2000];
        if (checkEmpty) {
          targetErrors.push(errors.emptyValueWeight);
        }
        return targetErrors.reduce((acc, v) => acc.concat(v.lim()), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.volume = {
      type: Number,
      $elem: document.querySelector('.input__field-volume-wrapper'),
      get value() {
        return iVolume.value;
      },
      event: 'change',
      lim(checkEmpty) {
        const targetErrors = [errors.volumeMore1, errors.volumeMore10];
        if (checkEmpty) {
          targetErrors.push(errors.emptyValueVolume);
        }
        return targetErrors.reduce((acc, v) => acc.concat(v.lim()), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.date = {
      type: Date,
      $elem: document.querySelector('.input__field-date-wrapper'),
      get value() {
        const selected = fDate.selectedDates[0];
        selected.setHours(0, 0, 0, 0);
        return selected;
      },
      event: 'change',
      lim(checkEmpty) {
        const targetErrors = [errors.dateLessCurrentDate, errors.deliveryToday];
        if (checkEmpty) {
          targetErrors.push(errors.emptyValueDate);
        }
        return targetErrors.reduce((acc, v) => acc.concat(v.lim()), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.box = {
      type: Number,
      $elem: document.querySelector('.input__field-box-wrapper'),
      get value() {
        return iBox.value;
      },
      event: 'change',
      lim(checkEmpty) {
        const targetErrors = [errors.bagAndBoxSelected, errors.needPackaging];
        return targetErrors.reduce((acc, v) => acc.concat(v.lim(checkEmpty)), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.film = {
      type: Number,
      $elem: document.querySelector('.input__field-flim-wrapper'),
      get value() {
        return iFilm.value;
      },
      event: 'change',
      lim(checkEmpty) {
        const targetErrors = [errors.onlyBox, errors.needPackaging];
        return targetErrors.reduce((acc, v) => acc.concat(v.lim(checkEmpty)), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };
    this.bag = {
      type: Number,
      $elem: document.querySelector('.input__field-bag-wrapper'),
      get value() {
        return iBag.value;
      },
      event: 'change',
      lim(checkEmpty) {
        const targetErrors = [errors.onlyBox,
          errors.bagsMore8,
          errors.bagAndBoxSelected,
          errors.needPackaging];

        return targetErrors.reduce((acc, v) => acc.concat(v.lim(checkEmpty)), [])
          .sort((a, b) => a.needAnimate - b.needAnimate);
      },
    };

    Object.defineProperty(this, 'checkEvery', {
      value: () => {
        runAnimation(getAllChecks(true));
        return errorsSet.size === 0;
      },
      enumerable: false,
    });

    Object.keys(this).forEach((v) => {
      this[v].$elem.querySelector('.input__field').addEventListener(this[v].event, (ev) => {
        runAnimation(this[v].lim());
        if (errorsSet.size === 0) {
          senderCalculator.switchLoadingDisplay(true);
          debounceSenderCalculator();
        }
      });
    });
  }());

  const orderSender = new Sender(API_ORDER_CREATOR,
    $loadingWrapperCreateOrder,
    $orderMainWrapper,
    undefined,
    components);

  $orderSubmit.addEventListener('click', async (ev) => {
    $orderSubmit.focus();
    ev.preventDefault();

    if (components.checkEvery()) {
      orderSender.switchLoadingDisplay(true);
      const data = await orderSender.getDataFromServer();

      setTimeout(() => {
        $success.innerText = `Заказ создан №${data._id} от ${new Date(data.createdDate).toLocaleDateString()}`;
        $wrapperSuccess.classList.add('active');
        setTimeout(() => $wrapperSuccess.classList.remove('active'), 2000);
      }, $wrapperSuccess.classList.contains('active') ? 300 : 0);

      $wrapperSuccess.classList.remove('active');
      $wrapperError.classList.remove('active');

      if (!data.errors) {
        history.pushState({ route: '/orders' }, 'spa', '/orders');
      }
    }
  });

  return { destructor: () => fDate.destroy() };
};
