import urlParser from './utils/urlParser';
import Sender from './sender';
import { TYPES_COLOR } from './utils/ordersType';

export default async ($navBar, $listUl, $loading) => {
  const SENDER_LIST = new Sender(`/api/orders_list/${location.search}`);
  const SENDER_COUNT = new Sender(`/api/orders_list/count${location.search}`);

  const [LIST, COUNT] = await Promise.all(
    [SENDER_LIST.getDataFromServer({}, 'GET'), SENDER_COUNT.getDataFromServer({}, 'GET')],
  );

  if (LIST.errors || COUNT.errors) {
    return;
  }

  const { COUNT_FIELDS, MAX_ELEMENTS_ON_PAGE } = COUNT;
  const PARAMS = urlParser.parseSearch();
  const CURR_PAGE = parseInt(urlParser.getParam('p'), 10) || 1;

  const TEMPLATE_URL = urlParser.getFormattedURL(PARAMS, ['p']);

  const buildNavBar = (countElements, currPage) => {
    while ($navBar.firstChild) {
      $navBar.removeChild($navBar.firstChild);
    }

    const newNavElem = (name, selected, link, exclusive) => {
      const $elem = exclusive || selected ? document.createElement('span') : document.createElement('a');
      if (selected) {
        $elem.classList.add('selected');
      }
      $elem.innerHTML = name;
      $navBar.appendChild($elem);

      if (!exclusive && !selected) {
        $elem.href = link;
        $elem.addEventListener('click', (ev) => {
          ev.preventDefault();
          history.pushState({ route: link }, 'spa', link);
        });
      }
    };

    const COUNT_PAGES = Math.ceil(countElements / MAX_ELEMENTS_ON_PAGE);

    if (COUNT_PAGES > 1) {
      const LEFT_HEAND = COUNT_PAGES > 7 && currPage > 4;
      const RIGHT_HEAND = COUNT_PAGES > 7 && currPage <= COUNT_PAGES - 4;

      let leftCount = LEFT_HEAND ? currPage - 2 : 1;
      let rightCount = RIGHT_HEAND ? currPage + 2 : COUNT_PAGES;

      if (LEFT_HEAND && !RIGHT_HEAND) {
        leftCount = COUNT_PAGES - 5;
      } else if (!LEFT_HEAND && RIGHT_HEAND && currPage < 5) {
        rightCount = 6;
      }


      const countOfElements = 1 + rightCount - leftCount
                + (LEFT_HEAND && 2) + (RIGHT_HEAND && 2);

      const elems = Array.from(Array(countOfElements));

      if (LEFT_HEAND) {
        elems[0] = 1;
        elems[1] = '...';
      }

      if (RIGHT_HEAND) {
        elems[elems.length - 2] = '...';
        elems[elems.length - 1] = COUNT_PAGES;
      }

      let sp = leftCount;
      const it = LEFT_HEAND ? 2 : 0;
      for (let i = it; i !== (RIGHT_HEAND ? elems.length - 2 : elems.length); i += 1, sp += 1) {
        elems[i] = sp;
      }

      elems.forEach((v) => newNavElem(v, v === currPage, `${TEMPLATE_URL}p=${v}`, v === '...'));
    }
  };

  const buildElementsOfList = (list) => {
    while ($listUl.firstChild) {
      $listUl.removeChild($listUl.firstChild);
    }

    if (list.length === 0) {
      const li = document.createElement('li');
      li.setAttribute('id', 'orders-list-li-not-found');

      const divImage = document.createElement('div');
      divImage.classList.add('orders-list-div-not-found');
      li.appendChild(divImage);

      const detail = document.createElement('h3');
      detail.innerText = 'Извините, но по вашему запросу ничего не найдено';
      li.appendChild(detail);
      $listUl.appendChild(li);
    } else {
      list.forEach((elem) => {
        const li = document.createElement('li');

        const link = document.createElement('a');
        link.classList.add('orders-list-li-title');
        link.href = `/view?id=${elem._id}`;

        if (CURR_PAGE === elem._id) {
          link.classList.add('selected');
        }

        link.innerText = `Заказ №${elem._id} от ${new Date(elem.createdDate).toLocaleDateString()}`;

        link.addEventListener('click', (ev) => {
          ev.preventDefault();
          history.pushState({ route: link.href }, 'spa', link.href);
        });

        li.appendChild(link);

        const detail = document.createElement('span');
        detail.classList.add('orders-list-li-detail');
        detail.innerText = elem.detail;
        li.appendChild(detail);

        const moreInfomation = document.createElement('div');
        moreInfomation.classList.add('orders-list-li-more');

        const marker = document.createElement('span');
        marker.classList.add('orders-list-li-marker');
        marker.classList.add(TYPES_COLOR[elem.type].color);
        moreInfomation.appendChild(marker);

        const type = document.createElement('span');
        type.classList.add('orders-list-li-type');
        type.innerText = TYPES_COLOR[elem.type].name;
        moreInfomation.appendChild(type);

        const sum = document.createElement('span');
        sum.classList.add('orders-list-li-sum');
        sum.innerText = `${elem.sum} руб.`;
        moreInfomation.appendChild(sum);

        const cities = document.createElement('span');
        cities.classList.add('orders-list-li-cities');
        cities.innerText = `${elem.city_from.name}, ${elem.city_from.country} - ${elem.city_to.name}, ${elem.city_to.country}`;
        moreInfomation.appendChild(cities);

        li.appendChild(moreInfomation);
        $listUl.appendChild(li);
      });
    }
  };

  buildElementsOfList(LIST);
  if (LIST.length !== 0) {
    buildNavBar(COUNT_FIELDS, CURR_PAGE);
  }
  $loading.remove();
};
