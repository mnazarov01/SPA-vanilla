
import Sender from './sender';

class CitiesList {
  constructor(target) {
    this.body = target;
    this.loadingDots = document.querySelector('.wrapper-sticky-table>.loading_dots');
    this.sender = new Sender('/api/cities-list', this.loadingDots, undefined, undefined);
    this.complite = false;

    this.sender.switchLoadingDisplay(true);

    const tableHead = document.querySelector('.wrapper-sticky-table .cities-list-head');

    const createNodes = (() => {
      let inRun = false;
      return async (entry, observer) => {
        if (inRun) { return; }

        inRun = true;
        if (entry.intersectionRatio > 0.5) {
          const lastElem = this.body.querySelector('tr:last-child');
          const lastIndex = lastElem ? +lastElem.dataset.index + 1 : 0;

          const res = await this.sender.getDataFromServer(undefined, 'GET', `?lastIndex=${lastIndex}`);
          if (res.errors) {
            console.error(res.errors);
          } else {
            let last;
            res.data.forEach((v) => {
              const $tr = document.createElement('tr');
              $tr.dataset.index = v._id;
              Object.keys(v)
                .filter((prop) => ['name', 'country'].indexOf(prop) !== -1)
                .forEach((prop) => {
                  const $th = document.createElement('th');
                  $th.innerText = v[prop];
                  $tr.appendChild($th);
                });
              this.body.appendChild($tr);
              last = v._id;
            });

            const resultLastIndex = res.last ? res.last._id : undefined;
            this.complite = resultLastIndex === last;

            observer.unobserve(entry.target);
            observer.observe(this.body.querySelector('tr:last-child') || entry.target);
          }
        }
        inRun = false;
      };
    })();

    const observer = new IntersectionObserver((entries, obs) => {
      if (!this.complite) {
        this.sender.switchLoadingDisplay(true);
        entries.forEach((entry) => createNodes(entry, obs));
      }
    }, { threshold: 0.5 });

    observer.observe(tableHead);

    this.functionCreatedNewCity = () => {
      observer.disconnect();
      this.complite = false;
      observer.observe(this.body.querySelector('tr:last-child') || tableHead);
    };

    window.addEventListener('created-new-city', this.functionCreatedNewCity);
  }

  destructor() {
    window.removeEventListener('created-new-city', this.functionCreatedNewCity);
  }
}

export default CitiesList;
