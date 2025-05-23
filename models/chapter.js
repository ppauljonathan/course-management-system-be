'use strict';

const db = require('../config/database');
const { PER_PAGE } = require('../constants');
const { dbLogger } = require('../services/db');
const { findWithPagination } = require('./concerns/pagination');

module.exports.findByCourseId = async (courseId, page = 1, per = PER_PAGE) => {
  const chaptersData = await findWithPagination(
    'chapters',
    `
      course_id = $1
    `,
    [courseId],
    page,
    per
  )

  return chaptersData;
};


module.exports.create = async({}, courseId) => {

};

module.exports.update = async({id}, courseId) => {

};

module.exports.destroy = async(id) => {
  const query = `
    DELETE FROM chapters
    WHERE id = $1
    RETURNING *
  `;
  const variables = [id];

  dbLogger(query, variables);

  const result = await db.query(query, variables);
  const chapter = result.rows[0] || null;

  return { chapter, errors: [] };
};
