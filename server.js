'use strict';

const express = require('express');
const { configDotenv } = require('dotenv');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');

const db = require('./config/database');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');

const PORT = process.env.PORT || 3000;

configDotenv();
const app = express();

app.use(express.json());

app.all(
    '/graphql',
    createHandler({
        schema: schema,
        rootValue: rootValue,
    }),
);

app.get('/', (_req, res) => {
    res.type('html');
    res.end(ruruHTML({ endpoint: '/graphql' }));
});

db.connect()
  .then(() => {
      console.log('Connected to DB');
      app.listen(PORT, () => {
          console.log(`Listening on ${PORT}`);
      });
  });
