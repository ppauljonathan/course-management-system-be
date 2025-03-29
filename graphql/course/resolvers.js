'use strict';

const Course = require('../../models/course');
const { getAuthenticatedUser } = require('../../services/auth')

const courses = async ({page, per}) => {
  return await Course.findAll(page, per);
};

const purchasedCourses = async({page, per}) => {
  return {
    courses: [],
    pageInfo: {
    }
  }
}

const createdCourses = async({page, per}) => {
  return {
    courses: [],
    pageInfo: {
    }
  }
}

const course = async ({ id }, context) => {
  getAuthenticatedUser(context);
  return await Course.find(id);
};

const courseCreate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.create(course);
};

const courseUpdate = async ({ course }, context) => {
  getAuthenticatedUser(context);
  return await Course.update(course);
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
