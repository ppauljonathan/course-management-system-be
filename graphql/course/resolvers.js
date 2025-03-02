'use strict';

const Course = require('../../models/course');
const { getAuthenticatedUser } = require('../../services/auth')

const courses = async ({page, per}, context) => {
  getAuthenticatedUser(context);
  return await Course.findAll(page, per);
};

const course = async ({ id }, context) => {
  getAuthenticatedUser(context);
  return await Course.find(id);
};

const courseCreate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.create(course);
};

const courseUpdate = async ({ course }, context) => {
  getAuthenticatedUser();
  return await Course.update(course);
};

const courseDelete = async ({ id }, context) => {
  getAuthenticatedUser(context);
  return await Course.destroy(id);
};

const resolvers = { courses, course, courseCreate, courseUpdate, courseDelete }

module.exports = resolvers;
