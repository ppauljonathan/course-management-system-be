'use strict';

const validateIdentifier = (type, name) => {
	if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
		throw new Error(`Invalid ${type}: ${name}`);
	}
	return name;
};

module.exports.validateTableName = (tableName) => validateIdentifier("table name", tableName);
module.exports.validateColumnName = (column) => validateIdentifier("column name", column);
