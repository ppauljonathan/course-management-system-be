'use strict';

const Course = require('../../models/course');
const { getAuthenticatedUser } = require('../../services/auth')

const courses = async ({page, per}) => {
  return await Course.findAll(page, per);
};

const purchasedCourses = async({page, per}, context) => {
  getAuthenticatedUser(context);
  return {
    courses: [],
    pageInfo: {
      page: page,
      per: per,
      totalPages: 1,
      totalRecords: 0
    }
  }
}

const createdCourses = async({page, per}, context) => {
  getAuthenticatedUser(context);
  return await Course.findByUserId(context.user.id, page, per);
}

const course = async ({ id }, context) => {
  getAuthenticatedUser(context);
  return await Course.find(id);
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
  return await Course.destroy(id);
};

const resolvers = {
  courses,
  purchasedCourses,
  createdCourses,
  course,
  courseCreate,
  courseUpdate,
  courseDelete
}

module.exports = resolvers;
