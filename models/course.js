'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { dbLogger } = require('../services/db');
const { courseCreationValidator, courseUpdationValidator, courseDeletionValidator } = require('../validators/course');
const { findWithPagination } = require('./concerns/pagination');
const { calculateCurrentTime } = require('./concerns/time');
const User = require('./user');

module.exports.findAll = async (
  page = 1,
  per = PER_PAGE,
  withUser = false,
  searchTerm = '',
  userIds = [],
  withTags = false
) => {
  let searchQuery = `
    live = $1
    AND deleted_at IS NULL
  `;
  const searchVariables = [true];
  let varIndex = 2;

  if (searchTerm) {
    searchQuery += ` AND (name ILIKE $${varIndex} OR description ILIKE $${varIndex})`;
    searchVariables.push(`%${searchTerm}%`);
    varIndex++;
  }

  if (userIds && userIds.length > 0) {
    searchQuery += ` AND user_id = ANY($${varIndex})`;
    searchVariables.push(userIds);
    varIndex++;
  }

  const coursesData = await findWithPagination(
    'courses',
    searchQuery,
    searchVariables,
    page,
    per
  );

  if (withUser) {
    coursesData.courses = await preloadUsers(coursesData.courses);
  }

  if (withTags) {
    coursesData.courses = await preloadTags(coursesData.courses);
  }

  return coursesData;
};

module.exports.findByUserId = async (
  userId,
  page = 1,
  per = PER_PAGE,
  withUser = false,
  searchTerm = null,
  withTags = false
) => {
  let searchQuery = `
    user_id = $1 AND
    deleted_at IS NULL
  `;
  const searchVariables = [userId];

  if (searchTerm) {
    searchQuery += ` AND
      (name ILIKE $2 OR description ILIKE $2)
    `;
    searchVariables.push(`%${searchTerm}%`);
  }
  const coursesData = await findWithPagination(
    'courses',
    searchQuery,
    searchVariables,
    page,
    per
  );

  if (withUser) {
    const user = await User.find(userId);
    coursesData.courses = coursesData.courses.map((course) => ({ ...course, user }));
  }

  if (withTags) {
    coursesData.courses = await preloadTags(coursesData.courses);
  }

  return coursesData;
};

module.exports.find = async (id, withUser = false, withTags = false) => {
  const query = `
    SELECT * FROM courses
    WHERE id = $1 AND deleted_at IS NULL
  `;
  const variables = [id];

  dbLogger(query, variables, 'Find Course');

  const result = await db.query(query, variables);
  let course = result.rows[0] || null;

  if (!course) { return; }

  if (withUser) {
    const user = await User.find(course.user_id);
    course.user = user;
  }

  if (withTags) {
    course = (await preloadTags([course]))[0];
  }

  return course;
};

module.exports.create = async ({ name, description, live }, userId) => {
  const errors = courseCreationValidator({ name, description });

  if (errors.length != 0) {
    return { errors };
  }

  const currentTime = calculateCurrentTime();

  const query = `
    INSERT INTO courses (name, description, created_at, updated_at, live, user_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const variables = [name, description, currentTime, currentTime, live, userId];

  dbLogger(query, variables, 'Create Course');

  const result = await db.query(query, variables);
  const course = result.rows[0];

  return { course, errors };
};

module.exports.update = async ({ id, name, description, live }, userId) => {
  const errors = await courseUpdationValidator({ id, name, description, userId });

  if (errors.length != 0) {
    return { errors };
  }

  const query = `
    UPDATE courses
    SET name = $1, description = $2, updated_at = $3, live = $4
    WHERE id = $5 AND deleted_at IS NULL
    RETURNING *
  `;
  const variables = [name, description, calculateCurrentTime(), live, id];

  dbLogger(query, variables, 'Update Course');

  const result = await db.query(query, variables);
  const course = result.rows[0] || null;

  return { course, errors };
};

module.exports.destroy = async (id, userId) => {
  const errors = await courseDeletionValidator({ id, userId });

  if (errors.length != 0) {
    return { errors };
  }

  const query = `
    UPDATE courses
    SET deleted_at = $1
    WHERE id = $2 AND deleted_at IS NULL
    RETURNING *
  `;
  const variables = [calculateCurrentTime(), id];

  dbLogger(query, variables, 'Delete Course');

  const result = await db.query(query, variables);
  const course = result.rows[0] || null;

  return { course, errors: [] };
};

module.exports.updateChapterOrder = async (id, chapterOrder) => {
  const course = await this.find(id);
  const errors = [];

  const sortedExisting = [...course.chapter_order].sort().join(',');
  const sortedNew = [...chapterOrder].sort().join(',');

  if (sortedExisting !== sortedNew) {
    errors.push({
      code: 422,
      location: 'chapter_order',
      message: 'chapter order is invalid'
    });
  }

  if (errors.length != 0) {
    return { errors };
  }

  const query = `
    UPDATE courses
    SET chapter_order = $1
    WHERE id = $2
    RETURNING *
  `;
  const variables = [chapterOrder, id];

  dbLogger(query, variables, 'update chapter order');

  const result = await db.query(query, variables);

  if (result.rowCount == 0) {
    errors.push({
      code: 500,
      message: 'Error Occured while updating chapter order',
      location: 'chapter_order'
    })
  }

  return { course: result.rows[0], errors }
}

async function preloadUsers(courses) {
  const userIds = [... new Set(courses.map(c => c.user_id))];

  const query = `
    SELECT * FROM users
    WHERE id = ANY($1)
  `;
  const variables = [userIds];

  dbLogger(query, variables, 'Preloading users');

  const result = await db.query(query, variables);

  const users = result.rows;
  const userIdMapping = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return courses.map((course) => ({ ...course, user: userIdMapping[course.user_id] }));
}

async function preloadTags(courses) {
  const courseIds = courses.map(c => c.id);
  const query = `
    SELECT courses.id as course_id, tags.*
    FROM courses
    INNER JOIN courses_tags
      ON courses.id = courses_tags.course_id
    INNER JOIN tags
      ON tags.id = courses_tags.tag_id
    WHERE courses.id = ANY($1)
  `;
  const variables = [courseIds];

  dbLogger(query, variables, 'Preloading tags');

  const result = await db.query(query, variables);
  const coursesTagJoin = result.rows;


  const tagMapping = coursesTagJoin.reduce((acc, row) => {
    const { course_id, ...rest } = row;
    if (acc[course_id] === undefined) {
      acc[course_id] = [];
    }
    acc[course_id].push(rest);

    return acc;
  }, {});

  return courses.map((course) => ({ ...course, tags: tagMapping[course.id] || [] }));
}
