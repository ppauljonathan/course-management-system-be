'use strict';

const { validatePresence, validateUniquness, validateLength } = require('./commonValidators');
const { EMAIL_REGEX } = require('../constants');

module.exports.userCreationValidator = async (userData) => {
  const errors = [];

  validatePresence('first_name', userData.first_name, errors);

  validatePresence('last_name', userData.last_name, errors);

  validatePresence('email', userData.email, errors);
  validateEmailFormat(userData.email, errors);
  await validateUniquness('email', userData.email, 'users', errors);

  validateLength('password', userData.password, { min: 8 }, errors);
  validateLength('password_confirmation', userData.password, { min: 8 }, errors);
  return errors;
};

function validateEmailFormat(email, errors) {
  if(email.match(EMAIL_REGEX)) { return; }

  errors.push({
    code: 422,
    message: 'email is not in valid format. example: abc@def.com',
    location: 'email'
  });
}
