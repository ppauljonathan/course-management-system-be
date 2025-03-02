'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { calculateCurrentTime } = require('./concerns/time');
const { findWithPagination } = require('./concerns/pagination');
const { userCreationValidator } = require('../validators/user');

module.exports.findAll = async (page = 1, per = PER_PAGE) => {
	return findWithPagination(
		'users',
		'deleted_at IS NULL',
		[],
		page,
		per
	);
};

module.exports.find = async (id) => {
	const result = await db.query(
		`
			SELECT * FROM users
			WHERE id = $1 AND deleted_at IS NULL
		`,
		[id]
	);
	return result.rows[0] || null;
};

module.exports.findByEmail = async (email) => {
	const result = await db.query(
		`
			SELECT * FROM users
			WHERE email = $1 AND deleted_at IS NULL
		`,
		[email]
	);
	return result.rows[0] || null;
}

module.exports.create = async (userData) => {
	const errors = await userCreationValidator(userData);
	if (errors.length != 0) { return { errors }; }

	const currentTime = calculateCurrentTime();
	const result = await db.query(
		`
			INSERT INTO users (first_name, last_name, email, password_hash, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING *
		`,
		[
			userData.first_name,
			userData.last_name,
			userData.email,
			userData.password_hash,
			currentTime,
			currentTime
		]
	);
	const user = result.rows[0]

	return { user, errors: [] };
}
