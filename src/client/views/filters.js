import Filter from '../handlers/filters';

export default {
  rendered: false,
  render: () => `
        <div class="wrapper-filters">
            <form id="filters_form" method="GET">
            <section id="filters">
                <section id="sorter" class="filter_section">
                    <div class="sorter_select-box">
                        <input type="checkbox" id="filter_main_input"></input>
                        <div class="sorter_select-button">
                            <div class="sorter_select-value">
                                <span id="sorter_main_label">Сортировка</span>
                            </div>
                            <svg id="sorter_select_image" height="16px" viewBox="0 0 512 512" width="16px" xmlns="http://www.w3.org/2000/svg"><path d="m366.996094 512c-11.046875 0-20-8.953125-20-20v-316.007812h-85.992188c-15.777344 0-29.894531-9.433594-35.96875-24.035157-6.097656-14.660156-2.8125-31.398437 8.367188-42.648437l91.09375-91.632813c11.332031-11.398437 26.425781-17.675781 42.5-17.675781 16.074218 0 31.167968 6.277344 42.5 17.675781l91.09375 91.632813c11.183594 11.246094 14.46875 27.988281 8.371094 42.648437-6.074219 14.601563-20.195313 24.035157-35.972657 24.035157h-21.988281c-11.046875 0-20-8.953126-20-20 0-11.046876 8.953125-20 20-20h19.710938l-89.582032-90.113282c-3.769531-3.789062-8.785156-5.878906-14.132812-5.878906-5.34375 0-10.363282 2.089844-14.132813 5.878906l-89.582031 90.113282h83.714844c22.058594 0 40 17.945312 40 40v316.007812c0 11.042969-8.953125 20-20 20zm0 0"/><path d="m144.988281 512c-16.074219 0-31.167969-6.277344-42.5-17.675781l-91.09375-91.632813c-11.183593-11.25-14.46875-27.988281-8.367187-42.648437 6.070312-14.601563 20.191406-24.039063 35.96875-24.039063h85.992187v-316.003906c0-11.046875 8.953125-20 20-20s20 8.953125 20 20v316.007812c0 22.054688-17.945312 40-40 40h-83.714843l89.582031 90.113282c3.769531 3.789062 8.789062 5.878906 14.132812 5.878906s10.363281-2.089844 14.132813-5.878906l89.582031-90.113282h-19.710937c-11.046876 0-20-8.953124-20-20 0-11.046874 8.953124-20 20-20h21.988281c15.777343 0 29.894531 9.433594 35.96875 24.035157 6.097656 14.660156 2.816406 31.402343-8.367188 42.648437l-91.09375 91.632813c-11.332031 11.398437-26.425781 17.675781-42.5 17.675781zm0 0"/></svg>
                        </div>
                        <div class="sorter_options">
                            <div class="sorter_option">
                                <input class="sorter_radio" type="radio" name="sorter" value="cd-desc">
                                <span class="sorter_label">Самые новые</span>
                            </div>
                            <div class="sorder_border"></div>
                            <div class="sorter_option">
                                <input class="sorter_radio" type="radio" name="sorter" value="cd-asc">
                                <span class="sorter_label">Самые старые</span>
                            </div>
                            <div class="sorder_border"></div>
                            <div class="sorter_option">
                                <input class="sorter_radio" type="radio" name="sorter" value="sum-desc">
                                <span class="sorter_label">Самые дорогие</span>
                            </div>
                            <div class="sorder_border"></div>
                            <div class="sorter_option">
                                <input class="sorter_radio" type="radio" name="sorter" value="sum-asc">
                                <span class="sorter_label">Самые дешевые</span>
                            </div>
                            <div id="sorter_magic_color">
                                <svg class="arrow" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492.004 492.004"
                                    style="fill:#fff;" xml:space="preserve">
                                    <g>
                                        <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
                                            c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
                                            c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
                                            c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="input_filter filter_section">
                    <div class="input_filter_wrapper">
                        <input id="input-filter-from" class="input__filter_field" type="text" placeholder="Откуда">
                        <svg id="input-filter-from-clear" class="clear_svg" height="16" viewBox="0 0 386.667 386.667" width="16"><path d="m386.667 45.564-45.564-45.564-147.77 147.769-147.769-147.769-45.564 45.564 147.769 147.769-147.769 147.77 45.564 45.564 147.769-147.769 147.769 147.769 45.564-45.564-147.768-147.77z"/></svg>
                    </div>
                    <ul id="input-filter-from-search" class="search-engine" style="opacity: 0;">
                        <li style="display: none;">
                            <div class="loading_dots">
                                <span class="dot"></span>
                                <div class="dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>
                <section class="input_filter filter_section">
                    <div class="input_filter_wrapper">
                        <input id="input-filter-to" class="input__filter_field" type="text" placeholder="Куда">
                        <svg id="input-filter-to-clear" class="clear_svg" height="16" viewBox="0 0 386.667 386.667" width="16"><path d="m386.667 45.564-45.564-45.564-147.77 147.769-147.769-147.769-45.564 45.564 147.769 147.769-147.769 147.77 45.564 45.564 147.769-147.769 147.769 147.769 45.564-45.564-147.768-147.77z"/></svg>
                    </div>
                    <ul id="input-filter-to-search" class="search-engine" style="opacity: 0;">
                        <li style="display: none;">
                            <div class="loading_dots">
                                <span class="dot"></span>
                                <div class="dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section>
            </section>
            <section class="filter_section">
                <div class="input_filter_search_wrapper">
                    <svg class="filter-search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 218 218" fill="#d1dede" width="20" height="20"><path d="M209.33 170.924l-54.375-54.394c5.082-10.625 8-22.48 8-35.045C162.966 36.482 126.48 0 81.48 0S0 36.482 0 81.48s36.48 81.48 81.48 81.48c12.573 0 24.42-2.936 35.056-8l54.383 54.375c10.598 10.61 27.804 10.61 38.408 0 10.61-10.612 10.61-27.815 0-38.405zM18.108 81.48c0-35.013 28.372-63.376 63.374-63.376s63.374 28.364 63.374 63.376c0 34.99-28.37 63.374-63.374 63.374s-63.374-28.38-63.374-63.374zm178.415 115.044a9.05 9.05 0 0 1-12.801 0l-51.415-51.42c4.722-3.8 9.015-8.084 12.803-12.806l51.412 51.426c1.7 1.697 2.654 4 2.654 6.4s-.955 4.704-2.654 6.4z"/></svg>
                    <input id="input-filter-search" class="input__filter_field" type="text" placeholder="Номер заказа">
                </div>
                <input id="filter_search_button" type="submit" value="Поиск"></input>
            </section>
            </form>
        </div>
    `,
  afterRender() {
    Filter.sortRediraction();
    const ignore = new Filter(
      { inputId: 'input-filter-from', inputUl: 'input-filter-from-search', inputClearId: 'input-filter-from-clear' },
      { inputId: 'input-filter-to', inputUl: 'input-filter-to-search', inputClearId: 'input-filter-to-clear' },
      'input-filter-search',
      { nodeId: 'sorter', mainLabelId: 'sorter_main_label', mainInputId: 'filter_main_input' },
      'filter_search_button',
    );
  },
};
