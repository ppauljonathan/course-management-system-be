'use strict';

const mutations = `
  courseCreate(course: CourseCreateInput!): CourseMutationResponse!
  courseUpdate(course: CourseUpdateInput!): CourseMutationResponse!
  courseDelete(id: ID!): CourseMutationResponse!
`;

module.exports = mutations;
