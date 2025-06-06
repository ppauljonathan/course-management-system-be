'use strict';

const Chapter = require('../../models/chapter');
const { getAuthenticatedUser } = require('../../services/auth');


const chapters = async ({ courseId, page, per }, _context, _info) => {
  return await Chapter.findByCourseId(courseId, page, per);
}

const chapter = async ({ id }, context, _info) => {
  getAuthenticatedUser(context);
  return await Chapter.find(id);
}

const chapterCreate = async ({ chapter }, context, _info) => {
  getAuthenticatedUser(context);

  return await Chapter.create(chapter, context.user.id);
}

const resolvers = {
  chapters,
  chapter,
  chapterCreate
};

module.exports = resolvers;
