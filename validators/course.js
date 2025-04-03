'use strict';

const { validatePresence, validateLength } = require('./commonValidators');
const db = require('../config/database')

module.exports.courseCreationValidator = ({ name, description, price }) => {
	const errors = [];

	validatePresence('name', name, errors);

	validatePresence('description', description, errors);
	validateLength('description', description, { min: 10 }, errors);

	validatePresence('price', price, errors);

	return errors;
}

module.exports.courseUpdationValidator = async ({ id, name, description, price, userId }) => {

	const errors = [];
	validatePresence('id', id, errors);

	validatePresence('name', name, errors);

	validatePresence('description', description, errors);
	validateLength('description', description, { min: 10 }, errors);

	validatePresence('price', price, errors);

  await validateUserIsCreator(id, userId, errors)

	return errors;
}

async function validateUserIsCreator(id, userId, errors) {
  const query = `
    SELECT user_id
    FROM courses
    WHERE courses.id = $1
  `;
  const result = await db.query(query, [id]);
  const dbUserId = parseInt(result.rows[0].user_id, 10);

  if(userId === dbUserId) { return; }


  errors.push({
    code: 422,
    message: 'You are not authorized to create Courses',
    location: 'name'
  })
}
