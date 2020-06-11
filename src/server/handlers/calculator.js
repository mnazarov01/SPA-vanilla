module.exports = (new function () {
  const orderType = {
    common: 1,
    avia: 2,
    vip: 3,
  };

  const prices = {
    avia: 0.3,
    vip: 0.13,
    box: 100,
    film: 30,
    bag: 80,
    differentCities: 230,
    sameCities: 160,
    deliveryToday: 0.4,
  };

  const templateInfo = {
    common: 'Обычная перевозка',
    avia: `Наценка за авиа - ${prices.avia * 100}% на перевозку`,
    vip: `1 класс делает все услуги дороже на ${prices.vip * 100}%`,
    box: `Стандартная цена коробки - ${prices.box} x `,
    film: `Стандартная цена пленки - ${prices.film} x `,
    bag: `Стандартная цена мешка – ${prices.bag} x `,
    differentCities: `Стандартная цена перевозки между любыми городами – ${prices.differentCities}`,
    sameCities: `Стандартная цена перевозки внутри одного города – ${prices.sameCities}`,
    deliveryToday: `За доставку в течение сегодняшнего дня наценка ${prices.deliveryToday * 100}% на перевозку`,
  };

  this.calculate = async (data) => {
    const detail = [];
    let sum = 0;

    const costDeliveryToday = prices.deliveryToday + 1;
    const currDeliveryPrice = data.deliveryToday ? costDeliveryToday : 1;

    const sameCities = (data.city_from !== '-1' && data.city_to !== '-1') ? data.city_from === data.city_to : false;
    const currCityPrice = sameCities ? prices.sameCities : prices.differentCities;

    const packaging = data.box * prices.box
            + data.film * prices.film
            + data.bag * prices.bag;

    const vipCost = prices.vip + 1;
    const packagingSum = packaging * vipCost;
    const sameCitiesSum = prices.sameCities * vipCost;
    const deliveryTodayCost = prices.deliveryToday + vipCost;

    switch (Number(data.type)) {
      case orderType.common:

        detail.push(templateInfo.common);
        sum = (packaging + currCityPrice) * currDeliveryPrice;
        break;

      case orderType.avia:

        detail.push(templateInfo.avia);
        sum = (packaging + currCityPrice) * (prices.avia + 1);
        break;

      case orderType.vip:

        detail.push(templateInfo.vip);
        sum = (packagingSum + (sameCities ? sameCitiesSum : prices.differentCities))
                    * (data.deliveryToday ? deliveryTodayCost : 1);
        break;

      default:
        return detail.push('<li>Для расчета стоимости необходимо ввести данные ...');
    }

    sum = sum.toFixed(2);

    if (data.box) {
      detail.push(templateInfo.box + data.box);
    }
    if (data.film) {
      detail.push(templateInfo.film + data.film);
    }
    if (data.bag) {
      detail.push(templateInfo.bag + data.bag);
    }

    detail.push(sameCities ? templateInfo.sameCities : templateInfo.differentCities);

    if (data.deliveryToday) {
      detail.push(templateInfo.deliveryToday);
    }

    return { detail, sum };
  };

  this.format = ({ detail, sum }) => '<li>Детали расчета</li>'.concat(detail.reduce((acc, v) => acc += `<li>${v}</li>`, '')
    .concat(`<li>Общая сумма: <span>${sum}</span></li>`));
}());
