'use strict';

const db = require('../config/database')
const { dbLogger } = require("../services/db");
const { validatePresence, validateLength } = require("./commonValidators");

module.exports.chapterCreationValidator = async ({ title, content, courseId, userId }) => {
  const errors = [];


  validatePresence('title', title, errors);

  validatePresence('content', content, errors);
  validateLength('content', content, { min: 10 }, errors);

  validatePresence('courseId', courseId, errors);
  await validateCourseExistsAndUserIsCreator(courseId, userId, errors);


  return errors;
}

module.exports.chapterUpdationValidator = async ({ title, content, courseId }) => {}

async function validateCourseExistsAndUserIsCreator(courseId, userId, errors) {
  const query = `
    SELECT id, user_id
    FROM courses
    WHERE id = $1
  `;
  const variables = [courseId];

  dbLogger(query, variables);

  const result = await db.query(query, variables);

  if(result.rows.count == 0) {
    errors.push({
      code: 404,
      message: 'Course not found',
      location: 'course_id'
    });

    return;
  }

  if(result.rows[0].user_id == userId) { return; }

  errors.push({
    code: 422,
    message: 'User not Authorized to Edit this Course',
    location: 'user_id'
  });
}

