
import CitiesList from '../handlers/citiesList';

let list = null;
const citiesList = {
  render: () => `
        <div class="wrapper-sticky-table">
            <div class="sticky-table">
                <table class="cities-list">
                    <thead class="cities-list-head">
                        <tr>
                            <th>Город</th>
                            <th>Страна</th>
                        </tr>
                    </thead>
                    <tbody class="cities-list-body"></tbody>
                </table>
            </div>
            <div class="loading_dots">
                <span class="dot"></span>
                    <div class="dots">    
                        <span></span>
                        <span></span>
                        <span></span>    
                </div> 
            </div>
        </div>
        `,
  afterRender: () => {
    list = new CitiesList(document.querySelector('.cities-list-body'));
  },
  preRender: () => list.destructor(),
};

export default citiesList;
