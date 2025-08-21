'use strict';

const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');
const cors = require('cors');

const db = require('./config/database');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const { context } = require('./graphql/context');
const { PORT } = require('./constants');
const { authenticateUser } = require('./middlewares/authenticateUser');
const { graphqlLogger } = require('./middlewares/graphqlLogger');

const app = express();

// Parse env origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use(graphqlLogger);

app.use(authenticateUser);

app.all(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: rootValue,
    context: context
  }),
);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

// export app for Vercel
module.exports = app;

// only start server locally
if (require.main === module) {
  db.connect()
    .then(() => {
      console.log('Connected to DB');
      app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
      });
    });
}
