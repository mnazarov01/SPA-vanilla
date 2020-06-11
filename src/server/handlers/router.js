
module.exports = (autoIncrement) => {
  const { Router } = require('express');
  const calculator = require('./calculator.js');
  const orderCreator = require('./orderCreator.js');
  const cityCreator = require('./cityCreator.js');
  const Models = require('../models/models.js');
  const path = require('path');
  const router = Router();

  const models = Models(autoIncrement);
  const SORTS = {
    'cd-desc': { createdDate: 'desc' },
    'cd-asc': { createdDate: 'asc' },
    'sum-desc': { sum: 'desc' },
    'sum-asc': { sum: 'asc' },
  };

  const ENTRIES_COUNT = 10;

  function getFormattedQuery(query) {
    const formatedQuery = {};
    Object.entries(query).forEach(([key, value]) => formatedQuery[key.toLowerCase()] = value);

    return formatedQuery;
  }

  function getParameters(query) {
    const QUERY = getFormattedQuery(query);

    const PAGE = parseInt(QUERY.p, 10) || 1;
    const CT = parseInt(QUERY.ct, 10) >= 0 ? parseInt(QUERY.ct, 10) : -1;
    const CF = parseInt(QUERY.cf, 10) >= 0 ? parseInt(QUERY.cf, 10) : -1;
    const SEARCH = parseInt(QUERY.search, 10) >= 0 ? parseInt(QUERY.search, 10) : -1;
    const SORT = SORTS[QUERY.sort];

    const filter = {}; let
      skip = 0;
    if (CT !== -1) {
      filter.city_to = CT;
    }
    if (CF !== -1) {
      filter.city_from = CF;
    }
    if (PAGE > 1) {
      skip = (ENTRIES_COUNT * PAGE) - ENTRIES_COUNT;
    }
    if (SEARCH !== -1) {
      filter.number = new RegExp(`${SEARCH}`, 'i');
    }

    return { filter, skip, sort: SORT };
  }

  router.post('/api/calculator', async (req, res) => {
    const DATA = await calculator.calculate(req.body);
    res.send(JSON.stringify(calculator.format(DATA)));
  });

  router.post('/api/order-creator', async (req, res) => {
    const NEW_ORDER = await orderCreator(req.body, models.order);
    res.send(NEW_ORDER);
  });

  router.post('/api/create-city', async (req, res) => {
    const STATUS = await cityCreator(req.body, models.city);
    res.send(STATUS);
  });

  router.get('/api/city', async (req, res) => {
    const QUERY = getFormattedQuery(req.query);
    let cities = {};

    const filter = {};
    if (QUERY.value) {
      filter.name = new RegExp(`^${QUERY.value}`, 'i');
    }
    if (QUERY.id) {
      filter._id = QUERY.id;
    }

    try {
      cities = await models.city.find(filter, '_id name country').limit(6);
    } catch (e) {
      cities.error = e.message;
    }
    res.send(JSON.stringify(cities));
  });

  router.get('/api/cities-list', async (req, res) => {
    const QUERY = getFormattedQuery(req.query);
    const RESULT = {};

    try {
      const CITIES = await models.city
        .find({ _id: { $gte: Number(QUERY.lastindex) } }, '_id name country')
        .limit(10);

      const LAST = await models.city.findOne({}, '_id').sort({ _id: 'desc' });

      RESULT.last = LAST;
      RESULT.data = CITIES;
    } catch (e) {
      RESULT.error = e.message;
    }
    res.send(JSON.stringify(RESULT));
  });

  router.get('/api/orders_list/count', async (req, res) => {
    const PARAMS = getParameters(req.query);
    const RESULT = { MAX_ELEMENTS_ON_PAGE: ENTRIES_COUNT };

    try {
      const COUNT = await models.order.count(PARAMS.filter);
      RESULT.COUNT_FIELDS = COUNT;
    } catch (e) {
      RESULT.error = e.message;
    }
    res.send(JSON.stringify(RESULT));
  });

  router.get('/api/order', async (req, res) => {
    const QUERY = getFormattedQuery(req.query);
    let order = {};

    try {
      order = await models.order.findOne({ _id: QUERY.id }, '-__v')
        .populate('city_from city_to', '-_id -__v');
      if (!order) {
        order = {};
        throw new Error('Такого заказа не существует');
      }
    } catch (e) {
      order.error = e.message;
    }
    res.send(JSON.stringify(order));
  });

  router.get('/api/orders_list', async (req, res) => {
    const PARAMS = getParameters(req.query);
    let orders = {};
    try {
      orders = await models.order.find(PARAMS.filter, '_id createdDate date detail city_from city_to type sum')
        .sort(PARAMS.sort).skip(PARAMS.skip).limit(ENTRIES_COUNT)
        .populate('city_from city_to', '-_id -__v');
    } catch (e) {
      orders.error = e.message;
    }
    res.send(JSON.stringify(orders));
  });

  router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client/index.html'));
  });

  return router;
};
