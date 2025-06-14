'use strict';

const Course = require('../../models/course');
const { getAuthenticatedUser } = require('../../services/auth');
const { containsSelection } = require('../helpers');

const courses = async ({page, per}, _context, info) => {
  const withUser = containsSelection(info, 'user');
  return await Course.findAll(page, per, withUser);
};

const createdCourses = async({page, per}, context, info) => {
  getAuthenticatedUser(context);
  const withUser = containsSelection(info, 'user');
  return await Course.findByUserId(context.user.id, page, per, withUser);
}

const course = async ({ id }, _context, info) => {
  const withUser = containsSelection(info, 'user');
  return await Course.find(id, withUser);
};

const courseCreate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.create(course, context.user.id);
};

const courseUpdate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.update(course, context.user.id);
};

const courseDelete = async ({ id }, context) => {
  getAuthenticatedUser(context);
  return await Course.destroy(id, context.user.id);
};

const resolvers = {
  courses,
  createdCourses,
  course,
  courseCreate,
  courseUpdate,
  courseDelete
}

module.exports = resolvers;
