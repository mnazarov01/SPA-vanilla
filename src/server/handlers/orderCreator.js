const calculator = require('./calculator.js');

module.exports = async (data, Model) => {
  try {
    const N_DATA = { ...data };
    const CALC_DATA = await calculator.calculate(data);
    N_DATA.detail = CALC_DATA.detail.join(', ');
    N_DATA.sum = CALC_DATA.sum;
    N_DATA.createdDate = Date.now();

    N_DATA.box = Number(N_DATA.box);
    N_DATA.film = Number(N_DATA.film);
    N_DATA.bag = Number(N_DATA.bag);

    const ORDER = new Model(N_DATA);
    ORDER.nextCount((err, count) => {
      ORDER.number = count;
    });

    await ORDER.save();
    return ORDER;
  } catch (e) {
    return { error: e.message };
  }
};
