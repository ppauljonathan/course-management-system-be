'use strict';

const { parse } = require('graphql');

const Course = require('../../models/course');
const { getAuthenticatedUser } = require('../../services/auth');
const { containsSelection } = require('../helpers');

const courses = async ({page, per}, _context, info) => {
  const withUser = containsSelection(info, 'user');
  return await Course.findAll(page, per, withUser);
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

const createdCourses = async({page, per}, context, info) => {
  getAuthenticatedUser(context);
  const withUser = containsSelection(info, 'user');
  return await Course.findByUserId(context.user.id, page, per, withUser);
}

const course = async ({ id }, context, info) => {
  getAuthenticatedUser(context);
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
