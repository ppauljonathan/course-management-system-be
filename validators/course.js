'use strict';

const { validatePresence, validateLength } = require('./commonValidators');
const db = require('../config/database');
const { dbLogger } = require('../services/db');

module.exports.courseCreationValidator = ({ name, description }) => {
  const errors = [];

  validatePresence('name', name, errors);

  validatePresence('description', description, errors);
  validateLength('description', description, { min: 10, max: 2000 }, errors);

  return errors;
}

module.exports.courseUpdationValidator = async ({ id, name, description, userId }) => {
  const errors = [];
  validatePresence('id', id, errors);

  validatePresence('name', name, errors);

  validatePresence('description', description, errors);
  validateLength('description', description, { min: 10, max: 2000 }, errors);

  await validateUserIsOwner(id, userId, errors)

  return errors;
}

async function validateUserIsOwner(id, userId, errors) {
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
    code: 403,
    message: 'you are not authorized to edit this course',
    location: 'name'
  })
}
