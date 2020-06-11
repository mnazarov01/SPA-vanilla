
const IS_PROD = process.env.NODE_ENV === 'production';

const start = async () => {
  try {
    const mongoose = require('mongoose');
    const autoIncrement = require('mongoose-auto-increment');
    const config = require('config');

    const URL = IS_PROD ? config.get('dbConnection.prod') : config.get('dbConnection.dev');
    const PORT = IS_PROD ? config.get('applicationPort.prod') : config.get('applicationPort.dev-api');

    const connection = await mongoose.connect(URL,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });

    autoIncrement.initialize(connection);

    const express = require('express');
    const path = require('path');
    const router = require('./handlers/router');
    const parser = require('body-parser');
    const RateLimit = require('express-rate-limit');

    const limiter = new RateLimit({
      windowMs: 1 * 60 * 1000,
      max: 600,
    });

    const app = express();

    app.use(parser.json());
    app.use('/public', express.static(path.join(__dirname, '..', 'client')));
    app.use(limiter);

    app.use(router(autoIncrement));

    app.listen(PORT, () => console.log(`Application (api-mode: ${!IS_PROD}) have been started on port: ${PORT}... Mongodb: ${URL}`));
  } catch (e) { console.error(e); }
};

start();
