'use strict';

const db = require('../config/database');
const { validateTableName, validateColumnName, dbLogger } = require('../services/db');

module.exports.validatePresence = (key, value, errors = []) => {
  if (!!value) { return; }

  errors.push({
    code: 422,
    message: `${key} must be present`,
    location: `${key}`
  });
};

module.exports.validateLength = (key, value, lengthParams, errors = []) => {
  if (lengthParams.min) {
  this.validateMinLength(key, value, lengthParams.min, errors);
  }

  if (lengthParams.max) {
    this.validateMaxLength(key, value, lengthParams.max, errors);
  }
};

module.exports.validateMinLength = (key, value, minLength, errors = []) => {
  if (value.length >= minLength) { return; }

  errors.push({
    code: 422,
    message: `${key} must have at least ${minLength} characters`,
    location: `${key}`
  });
};


module.exports.validateMaxLength = (key, value, maxLength, errors = []) => {
  if (value.length <= maxLength) { return; }

  errors.push({
    code: 422,
    message: `${key} must have at most ${maxLength} characters`,
    location: `${key}`
  });
}

module.exports.validateUniquness = async (key, value, tableName, errors = []) => {
  const query = `
    SELECT COUNT(id)
    FROM ${validateTableName(tableName)}
    WHERE
      ${validateColumnName(key)}=$1 AND
      deleted_at IS NULL
  `;
  const variables = [value];

  dbLogger(query, variables, `Validate Uniqueness of ${key} in ${tableName}`);

  const result = await db.query(query, variables);
  const count = parseInt(result.rows[0].count, 10);

  if(count == 0) { return; }

  errors.push({
    code: 422,
    message: `${key} is not unique`,
    location: `${key}`
  });
}
