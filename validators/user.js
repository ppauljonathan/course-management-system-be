'use strict';

const { validatePresence, validateUniquness } = require('./commonValidators');

module.exports.userCreationValidator = async (userData) => {
  const errors = [];

  validatePresence('first_name', userData.first_name, errors);

  validatePresence('last_name', userData.last_name, errors);

  validatePresence('email', userData.email, errors);
  await validateUniquness('email', userData.email, 'users', errors);

  return errors;
};
