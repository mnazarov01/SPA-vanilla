
module.exports = (autoIncrement) => {
  const { Schema, model } = require('mongoose');

  const schemaCity = new Schema({
    _id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    country: {
      type: String,
      required: true,
      default: '',
    },
  });

  const schemaOrder = new Schema({
    _id: {
      type: Number,
    },
    number: {
      type: String,
    },
    createdDate: {
      type: Date,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    city_from: {
      type: Number,
      required: true,
      ref: 'city',
    },
    city_to: {
      type: Number,
      required: true,
      ref: 'city',
    },
    weight: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    detail: {
      type: String,
      required: true,
      default: '',
    },
    sum: {
      type: Number,
      required: true,
      default: 0,
    },
    box: {
      type: Number,
      default: 0,
    },
    film: {
      type: Number,
      default: 0,
    },
    bag: {
      type: Number,
      default: 0,
    },
  });

  schemaCity.plugin(autoIncrement.plugin, { model: 'city', startAt: 1, incrementBy: 1 });
  schemaOrder.plugin(autoIncrement.plugin, { model: 'order', startAt: 1, incrementBy: 1 });
  return { city: model('city', schemaCity), order: model('order', schemaOrder) };
};
