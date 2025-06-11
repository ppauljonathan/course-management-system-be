'use strict';

const Chapter = require('../../models/chapter');
const { getAuthenticatedUser } = require('../../services/auth');


const chapters = async ({ courseId, page, per }, _context, _info) => {
  return await Chapter.findByCourseId(courseId, page, per);
}

const chapter = async ({ id }, _context, _info) => {
  return await Chapter.find(id);
}

const chapterCreate = async ({ chapter }, context, _info) => {
  getAuthenticatedUser(context);
  return await Chapter.create(chapter, context.user.id);
}

const chapterUpdate = async ({ chapter }, context, _info) => {
  getAuthenticatedUser(context);
  return await Chapter.update(chapter, context.user.id);
}

const chapterDelete = async ({ id }, context, _info) => {
  getAuthenticatedUser(context);
  return await Chapter.destroy(id);
}

const resolvers = {
  chapters,
  chapter,
  chapterCreate,
  chapterUpdate,
  chapterDelete
};

module.exports = resolvers;
