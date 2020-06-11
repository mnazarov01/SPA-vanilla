import Filters from './filters';
import Orders from './ordersList';

export default {
  render: () => `<div class="wrapper-filter-orders-list">${Filters.render()}${Orders.render()}</div>`,
  afterRender: () => {
    Filters.afterRender();
    Orders.afterRender();
  },
  preRender: () => {},
};
