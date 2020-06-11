
import { Sorter, SORTS_TYPES } from './sorter';
import SearchEngine from './searchEngine';
import urlParser from './utils/urlParser';

class Filters {
  static sortRediraction() {
    if (urlParser.needSortRedirection()) {
      urlParser.redirect(SORTS_TYPES.values().next().value);
    }
  }

  constructor(cityFrom, cityTo, searchId, sorter, searchButtonId) {
    const CF_VALUE = urlParser.getParam('cf');
    const CT_VALUE = urlParser.getParam('ct');

    this.seInputFrom = new SearchEngine(cityFrom.inputUl,
      cityFrom.inputId,
      false,
      cityFrom.inputClearId,
      { sessionStorageName: 'cities', restoreValue: CF_VALUE });

    this.seInputTo = new SearchEngine(cityTo.inputUl,
      cityTo.inputId,
      false,
      cityTo.inputClearId,
      { sessionStorageName: 'cities', restoreValue: CT_VALUE });

    this.search = IMask(document.querySelector(`#${searchId}`), { mask: Number, scale: 0, signed: false });
    this.search.value = urlParser.getParam('search') || '';

    this.sorter = new Sorter(sorter.nodeId, sorter.mainLabelId, sorter.mainInputId);

    document.querySelector(`#${searchButtonId}`).addEventListener('click', (ev) => {
      ev.preventDefault();

      const SE_IT = this.seInputTo.currentValue ? `ct=${this.seInputTo.currentValue.uid}&` : '';
      const SE_IF = this.seInputFrom.currentValue ? `cf=${this.seInputFrom.currentValue.uid}&` : '';
      const SEARCH = this.search.value ? `search=${this.search.value}&` : '';
      const SORT = this.sorter.target ? `sort=${this.sorter.target.value}` : `sort=${SORTS_TYPES.values().next().value}`;

      const NEW_URL = `?${SE_IT}${SE_IF}${SEARCH}${SORT}`;
      history.pushState({ route: NEW_URL }, 'spa', NEW_URL);
    });
  }
}

export default Filters;
