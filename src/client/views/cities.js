
import cityCreator from './cityCreator';
import citiesList from './citiesList';

export default {

  render: () => cityCreator.render() + citiesList.render(),

  afterRender: () => {
    cityCreator.afterRender();
    citiesList.afterRender();
  },

  preRender: () => {
    citiesList.preRender();
  },

};
