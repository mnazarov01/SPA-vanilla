import ordersList from '../handlers/ordersList';

export default {
  render: () => `<div class="orders-list">
            <svg id="orders-list-loading" class="loading" width="110" heigth="110" viewBox="0 0 110 110">
                <circle r="30" cx="55" cy="55" stroke="#f0f0f020" fill="none" stroke-width="12px"></circle>
                <circle class="loading__progress" r="30" cx="55" cy="55" fill="none" stroke="#f77a52" stroke-width="13px">
                </circle>
            </svg>  
            <ul id="orders-list-ul"></ul>    
            <nav id="sorter_filter_nav"></nav>
        </div>`,
  afterRender: () => {
    ordersList(document.querySelector('#sorter_filter_nav'),
      document.querySelector('#orders-list-ul'),
      document.querySelector('#orders-list-loading'));
  },
  preRender: () => {},
};
