'use strict';

const pg = require('pg');
const { configDotenv } = require('dotenv');
const { Pool } = pg;

configDotenv();

module.exports = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
});
