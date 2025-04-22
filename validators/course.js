'use strict';

const { validatePresence, validateLength } = require('./commonValidators');
const db = require('../config/database');
const { dbLogger } = require('../services/db');

module.exports.courseCreationValidator = ({ name, description, price }) => {
	const errors = [];

	validatePresence('name', name, errors);

	validatePresence('description', description, errors);
	validateLength('description', description, { min: 10 }, errors);

  validatePrice(price, errors);

	return errors;
}

module.exports.courseUpdationValidator = async ({ id, name, description, price, userId }) => {

	const errors = [];
	validatePresence('id', id, errors);

	validatePresence('name', name, errors);

	validatePresence('description', description, errors);
	validateLength('description', description, { min: 10 }, errors);

  validatePrice(price, errors);

  await validateUserIsCreator(id, userId, errors)

	return errors;
}

function validatePrice(price, errors) {
  if(typeof price === 'number' && price >= 0) { return; }

  errors.push({
		code: 422,
		message: "price must be present and greater than or equal to 0",
		location: "price"
	});
}

async function validateUserIsCreator(id, userId, errors) {
  const query = `
    SELECT user_id
    FROM courses
    WHERE courses.id = $1
  `;
  const variables = [id];

  dbLogger(query, variables);

  const result = await db.query(query, variables);
  const dbUserId = parseInt(result.rows[0].user_id, 10);

  if(userId === dbUserId) { return; }


  errors.push({
    code: 422,
    message: 'You are not authorized to create Courses',
    location: 'name'
  })
}
