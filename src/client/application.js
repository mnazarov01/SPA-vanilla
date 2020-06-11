
import Header from './views/header';
import Order from './views/order';
import Orders from './views/orders';
import Cities from './views/cities';
import Page404 from './views/page404';
import Viewer from './views/viewer';
import urlParser from './handlers/utils/urlParser';
import './css/main.css';

const routes = {
  '/': Order,
  '/create-city': Cities,
  '/orders': Orders,
  '/view/:id': Viewer,
};

let currPage = null;
const router = async () => {
  console.group('router function');
  console.time('router');

  // window.scrollTo(0, 0);

  const $header = document.getElementById('header_container');
  const $page = document.getElementById('page_container');

  // header content
  Header.render($header);
  Header.selectedElem();

  // body content
  if (currPage) {
    currPage.preRender();
  }

  const REQUEST = urlParser.parseURL();
  const TARGET_URL = (REQUEST.resource ? `/${REQUEST.resource}` : '/')
    + (REQUEST.verb ? `/${REQUEST.verb}` : '')
    + (REQUEST.hasId ? '/:id' : '');

  currPage = routes[TARGET_URL] ? routes[TARGET_URL] : Page404;
  $page.innerHTML = currPage.render();
  currPage.afterRender();

  console.timeEnd('router');
  console.groupEnd('router function');
};

(function () {
  const pushStateFunc = history.pushState;
  history.pushState = (...args) => {
    console.group('push state function');
    console.log(` -- location: ${document.location}`);
    pushStateFunc.apply(history, args);
    console.log(` -- location: ${document.location}`);
    router();

    console.groupEnd('push state function');
  };
}());

window.addEventListener('load', router);
// window.addEventListener('hashchange', router);
window.addEventListener('popstate', (ev) => {
  console.group('POP state function');
  console.log(` -- location: ${document.location}, state: ${JSON.stringify(ev.state)}`);
  router();
  console.groupEnd('POP state function');
});
