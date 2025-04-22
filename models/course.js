'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { dbLogger } = require('../services/db');
const { courseCreationValidator, courseUpdationValidator } = require('../validators/course');
const { findWithPagination } = require('./concerns/pagination');
const { calculateCurrentTime } = require('./concerns/time');
const User = require('./user');

module.exports.findAll = async (page = 1, per = PER_PAGE, withUser = false) => {
  const coursesData = await findWithPagination(
    'courses',
    `
      live = $1 AND
      deleted_at IS NULL
    `,
    [true],
    page,
    per
  );

  if(!withUser) { return coursesData; }

  coursesData.courses = await preloadUsers(coursesData.courses);
  return coursesData;
};

module.exports.findByUserId = async (userId, page = 1, per = PER_PAGE, withUser = false) => {
  const coursesData = await findWithPagination(
    'courses',
    `
      user_id = $1 AND
      deleted_at IS NULL
    `,
    [userId],
    page,
    per
  );

  if(!withUser) { return coursesData; }
  const user = await User.find(userId);
  coursesData.courses = coursesData.courses.map((course) => ({ ...course, user }));

  return coursesData;
};

module.exports.find = async (id, withUser = false) => {
  const query = `
    SELECT * FROM courses
    WHERE id = $1 AND deleted_at IS NULL
  `;
  const variables = [id];

  dbLogger(query, variables);

  const result = await db.query(query, variables);
  const course = result.rows[0] || null;

  if(!course) { return; }
  if(!withUser) { return course; }

  const user = await User.find(course.user_id);
  course.user = user;

  return course;
};

module.exports.create = async ({ name, description, price, live }, userId) => {
  const errors = courseCreationValidator({ name, description, price });

  if (errors.length != 0) {
    return { errors };
  }

  const currentTime = calculateCurrentTime();

  const query = `
    INSERT INTO courses (name, description, price, created_at, updated_at, live, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const variables = [name, description, price, currentTime, currentTime, live, userId];

  dbLogger(query, variables);

  const result = await db.query(query, variables);
  const course = result.rows[0];

  return { course, errors };
};

module.exports.update = async ({ id, name, description, price, live }, userId) => {
  const errors = await courseUpdationValidator({ id, name, description, price, userId });

  if (errors.length != 0) {
    return { errors };
  }

  const query = `
    UPDATE courses
    SET name = $1, description = $2, price = $3, updated_at = $4, live = $5
    WHERE id = $6 AND deleted_at IS NULL
    RETURNING *
  `;
  const variables = [name, description, price, calculateCurrentTime(), live, id];

  dbLogger(query, variables);

  const result = await db.query(query, variables);
  const course = result.rows[0] || null;

  return { course, errors };
};

module.exports.destroy = async (id) => {
  const query = `
    UPDATE courses
    SET deleted_at = $1
    WHERE id = $2 AND deleted_at IS NULL
    RETURNING *
  `;
  const variables = [calculateCurrentTime(), id];

  dbLogger(query, variables);

  const result = await db.query(query, variables);
  const course = result.rows[0] || null;

  return { course, errors: [] };
};

async function preloadUsers(courses) {
  const userIds = [... new Set(courses.map(c => c.user_id))];

  const query = `
    SELECT * FROM users
    WHERE id = ANY($1)
  `;
  const variables = [userIds];

  dbLogger(query, variables);

  const result = await db.query(query, variables);

  const users = result.rows;
  const userIdMapping = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {})
  courses = courses.map((course) => ({ ...course, user: userIdMapping[course.user_id] }));
  return courses;
}
