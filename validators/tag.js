'use strict';

const { validatePresence, validateLength } = require("./commonValidators");

module.exports.tagCreationValidator = async ({ name, description }) => {
  const errors = [];

  validatePresence('name', name, errors);
  validateLength('name', name, { max: 15 }, errors);

  validatePresence('description', description, errors);
  validateLength('description', description, { min: 5 }, errors);

  return errors;
}

module.exports.tagUpdationValidator = async ({ id, name, description }) => {
  const errors = [];

  validatePresence('id', id, errors);

  validatePresence('name', name, errors);
  validateLength('name', name, { max: 15 }, errors);

  validatePresence('description', description, errors);
  validateLength('description', description, { min: 5 }, errors);

  return errors;
}
