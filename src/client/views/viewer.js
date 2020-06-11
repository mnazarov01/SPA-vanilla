
import urlParser from '../handlers/utils/urlParser';
import page404 from './page404';
import { TYPES_COLOR } from '../handlers/utils/ordersType';
import Sender from '../handlers/sender';

const SENDER = new Sender('/api/order');

export default {
  render() {
    return `<div class="viewer_wrapper">
      <div class="viewer_wrapper_loading">
        <svg class="loading" width="110" heigth="110" viewBox="0 0 110 110">
          <circle r="30" cx="55" cy="55" stroke="#f0f0f020" fill="none" stroke-width="12px"></circle>
          <circle class="loading__progress" r="30" cx="55" cy="55" fill="none" stroke="#f77a52" stroke-width="13px">
          </circle>
        </svg>  
      </div> 
    </div>`;
  },
  async afterRender() {
    await this.renderOrder();
  },
  async renderOrder() {
    const ID = urlParser.getParam('id');
    const ORDER = await SENDER.getDataFromServer(undefined, 'GET', `?id=${ID}`);
    if (ORDER.errors) {
      return;
    }

    const WRAPPER = document.querySelector('.viewer_wrapper');

    const bildNodes = (wrapper, order) => {
      const DETAIL = order.detail.split(',').reduce((acc, v) => acc += `<span>${v}</span>`, '');

      wrapper.innerHTML = `
      <div class="viewer_transfer">
            <span class="viewer_details-title">Данные перевозки</span>
            <div class="viewer_transfer-trans-type">
                <span class="orders-list-li-marker ${TYPES_COLOR[order.type].color}"></span>
                <span>${TYPES_COLOR[order.type].name}</span>
            </div>
            <span>Заказ №${order._id} от ${new Date(order.createdDate).toLocaleDateString()}</span>
            <span> ${order.city_from.name}, ${order.city_from.country} - ${order.city_to.name}, ${order.city_to.country}</span>
            <span>Дата забора: ${new Date(order.date).toLocaleDateString()}</span>
            <span>Сумма: ${order.sum} руб.</span>
        </div>

        <div class="viewer_packaging">
            <span class="viewer_details-title">Данные груза</span>
            <span>Вес: ${order.weight}</span>
            <span>Объем: ${order.volume}</span>
            <span>Коробка: ${order.box}</span>
            <span>Пленка: ${order.film}</span>
            <span>Мешок: ${order.bag}</span>
        </div>

        <div class="viewer_details">
            <span class="viewer_details-title">Детали</span>
            ${DETAIL}
        </div>
        `;
    };

    while (WRAPPER.firstChild) {
      WRAPPER.removeChild(WRAPPER.firstChild);
    }

    if (ORDER) {
      bildNodes(WRAPPER, ORDER);
      WRAPPER.style.display = 'flex';
    } else {
      WRAPPER.innerHTML = page404.render();
    }
  },

  preRender: () => { },
};
