'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { courseCreationValidator, courseUpdationValidator } = require('../validators/course');
const { findWithPagination } = require('./concerns/pagination');
const { calculateCurrentTime } = require('./concerns/time');

module.exports.findAll = async (page = 1, per = PER_PAGE) => {
  return findWithPagination(
    'courses',
    `
      live = $1 AND
      deleted_at IS NULL
    `,
    [true],
    page,
    per
  );
};

module.exports.findByUserId = async (userId, page = 1, per = PER_PAGE) => {
  return findWithPagination(
    'courses',
    `
      user_id = $1 AND
      deleted_at IS NULL
    `,
    [userId],
    page,
    per
  );
};

module.exports.find = async (id) => {
  const result = await db.query(
    `
      SELECT * FROM courses
      WHERE id = $1 AND deleted_at IS NULL
    `,
    [id]
  );
  return result.rows[0] || null;
};

module.exports.create = async ({ name, description, price, live }, userId) => {
  const errors = courseCreationValidator({ name, description, price });

  if (errors.length != 0) {
    return { errors };
  }

  const currentTime = calculateCurrentTime();
  const result = await db.query(
    `
      INSERT INTO courses (name, description, price, created_at, updated_at, live, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [name, description, price, currentTime, currentTime, live, userId]
  );
  const course = result.rows[0];

  return { course, errors };
};

module.exports.update = async ({ id, name, description, price, live }, userId) => {
  const errors = await courseUpdationValidator({ id, name, description, price, userId });

  if (errors.length != 0) {
    return { errors };
  }

  const result = await db.query(
    `
      UPDATE courses
      SET name = $1, description = $2, price = $3, updated_at = $4, live = $5
      WHERE id = $6 AND deleted_at IS NULL
      RETURNING *
    `,
    [name, description, price, calculateCurrentTime(), live, id]
  );
  const course = result.rows[0] || null;

  return { course, errors };
};

module.exports.destroy = async (id) => {
  const result = await db.query(
    `
      UPDATE courses
      SET deleted_at = $1
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING *
    `,
    [calculateCurrentTime(), id]
  );
  const course = result.rows[0] || null;

  return { course, errors: [] };
};
