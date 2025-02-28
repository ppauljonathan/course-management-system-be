'use strict';

const express = require('express');
const { configDotenv } = require('dotenv');
const db = require('./config/database');

configDotenv();
const app = express();

app.get('/', async (req, res, next) => {
    res.send("Hello World");
})

db.connect()
  .then(() => {
      console.log('Connected to DB');
      app.listen(process.env.PORT, () => {
          console.log('Listening on 3000');
      });
  });
