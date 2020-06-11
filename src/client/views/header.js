import urlParser from '../handlers/utils/urlParser';

const Header = {
  rendered: false,
  render($elem) {
    if (this.rendered) { return; }
    $elem.innerHTML = `<div class="header_wrapper">
        <nav class="header_navbar">
          <div><svg id="menu_svg" version="1.1" viewBox="0 0 640 640" width="48" height="48">
            <path d="M10 60C10 60 395.3 60 430.32 60C780.59 60 605.46 860 395.3 560C255.19 360 10 10 10 10" id="top"></path>
            <path d="M10 310L430.32 310" id="middle"></path>
            <path d="M10 580C10 580 395.3 580 430.32 580C780.59 580 605.46 -220 395.3 80C255.19 280 10 630 10 630" id="bottom"></path>
          </svg></div>
          <ul class="header_navbar_list">
            <li><a class="navbar-item" href="/orders"><span>заказы</span></a></li>
            <li><a class="navbar-item" href="/"><span>новый заказ</span></a></li>
            <li><a class="navbar-item" href="/create-city"><span>новый город</span></a></li>
          </ul>
        </nav>
      </div>
      <div class="placeholder"></div>
      `;
    this.afterRender();
    this.rendered = true;
  },
  afterRender: () => {
    const MENU_SVG = document.querySelector('#menu_svg');
    const HEADER = document.querySelector('.header_wrapper');
    const HTML = document.querySelector('html');

    const svgMen = (cross) => {
      HEADER.style.height = cross ? '100%' : '48px';
    };

    MENU_SVG.addEventListener('click', () => {
      const IS_CROSS = MENU_SVG.classList.toggle('cross');
      HTML.classList.toggle('no-scroll');
      svgMen(IS_CROSS);
    });

    document.querySelectorAll('.navbar-item').forEach((v) => {
      v.addEventListener('click', (ev) => {
        ev.preventDefault();

        const mPath = [];
        let node = ev.target;
        while (node !== document.body) {
          mPath.push(node);
          node = node.parentNode;
        }

        const path = mPath.find((val) => val instanceof HTMLAnchorElement).pathname;
        const IS_CROSS = MENU_SVG.classList.contains('cross');

        if (IS_CROSS) {
          MENU_SVG.classList.remove('cross');
          HTML.classList.remove('no-scroll');
        }

        svgMen(false);
        history.pushState({ route: path }, 'spa', path);
      });
    });
  },

  selectedElem: () => {
    const REQUEST = urlParser.parseURL();
    const ALL = document.querySelectorAll('.navbar-item');
    const ELEMS = [...ALL];

    for (let i = 0; i < ALL.length; i += 1) {
      ALL[i].classList.remove('navbar-item-current');
    }
    const TARGET = ELEMS.find((v) => v.pathname === `/${REQUEST.resource}`);

    if (TARGET) {
      TARGET.classList.add('navbar-item-current');
    }
  },

};

export default Header;
