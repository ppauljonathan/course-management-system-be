'use strict';

const { validatePresence, validateLength } = require('./commonValidators');

module.exports.courseCreationValidator = ({ name, description, price }) => {
    const errors = [];
    validatePresence('name', name, errors);

    validatePresence('description', description, errors);
    validateLength('description', description, { min: 10 }, errors);

    validatePresence('price', price, errors);

    return errors;
}

module.exports.courseUpdationValidator = ({ id, name, description, price }) => {
    const errors = [];
    validatePresence('id', name, errors);

    validatePresence('name', name, errors);

    validatePresence('description', description, errors);
    validateLength('description', description, { min: 10 }, errors);

    validatePresence('price', price, errors);

    return errors;
}
