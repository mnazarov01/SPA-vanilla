import { SORTS_TYPES } from '../sorter';

export default {
  parseURL() {
    const URL = (location.pathname.slice(1).toLocaleLowerCase() || '/').split('/');
    const request = {
      resource: null,
      id: null,
      verb: null,
    };
    [request.resource] = URL;
    request.hasId = this.getParam('id');
    request.verb = URL.slice(1).join('/');
    return request;
  },
  parseSearch() {
    const params = {};
    (new URLSearchParams(location.search.toLocaleLowerCase())).forEach(((v, k) => params[k] = v));
    return params;
  },
  getParam: (param) => new URLSearchParams(location.search.toLocaleLowerCase()).get(param),

  getFormattedURL(params, lims) {
    const M_LIMS = lims || [];
    return Object.keys(params).reduce((acc, k) => {
      if (M_LIMS.indexOf(k) === -1) {
        acc += `${k}=${params[k]}&`;
      }
      return acc;
    }, '?');
  },
  needSortRedirection() {
    const SORT = this.getParam('sort');
    return !SORT || !SORTS_TYPES.has(SORT);
  },
  redirect(sortValue) {
    const NEW_URL = `${this.getFormattedURL(this.parseSearch(), ['sort'])}sort=${sortValue}`;
    history.replaceState({ route: NEW_URL }, 'spa', NEW_URL);
  },
};
