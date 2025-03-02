'use strict';

const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');

const db = require('./config/database');
const { schema } = require('./graphql/schema');
const { rootValue } = require('./graphql/rootValue');
const { PORT } = require('./constants');
const { authenticateUser } = require('./services/auth');

const app = express();

app.use(express.json());

app.use(authenticateUser);

app.all(
	'/graphql',
	createHandler({
		schema: schema,
		rootValue: rootValue,
		context: (req) => ({ user: req.raw.user })
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
