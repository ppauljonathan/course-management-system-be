'use strict';

const express = require('express');
const { configDotenv } = require('dotenv');
const db = require('./config/database');

configDotenv();
const app = express();

db.connect()
  .then(() => {
      console.log('Connected to DB');
      app.listen(process.env.PORT, () => {
          console.log('Listening on 3000');
      });
  });

