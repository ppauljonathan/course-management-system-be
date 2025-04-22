'use strict';

const db = require('../../config/database');
const { PER_PAGE, MAX_PER_PAGE, DEFAULT_PAGE } = require('../../constants');
const { validateTableName, dbLogger } = require('../../services/db');

module.exports.findWithPagination = async (
	table,
	conditionString = 'deleted_at IS NULL',
	conditionVars = [],
	page = DEFAULT_PAGE,
	per = PER_PAGE
) => {
	per = Math.min(per, MAX_PER_PAGE);

	const query = `
		SELECT * from ${validateTableName(table)}
		WHERE ${conditionString}
		ORDER BY id ASC
		LIMIT ${per}
		OFFSET ${(page - 1) * per}
  `;

  dbLogger(query, conditionVars);

	const result = await db.query(query, conditionVars);
	const pageInfo = await this.pageInfo(
		table, conditionString, conditionVars, page, per
	);

	return { [table]: result.rows, pageInfo };
};

module.exports.pageInfo = async (
	table,
	conditionString = 'deleted_at IS NULL',
	conditionVars = [],
	page = DEFAULT_PAGE,
	per = PER_PAGE
) => {
	const query = `
		SELECT count(id) from ${validateTableName(table)}
		WHERE ${conditionString}
	`;

  dbLogger(query, conditionVars);

	const result = await db.query(query, conditionVars);

	const count = parseInt(result.rows[0].count, 10);

	return {
		page: page,
		per: per,
		totalRecords: count,
		totalPages: Math.max(1, Math.ceil(count / per))
	};
};
