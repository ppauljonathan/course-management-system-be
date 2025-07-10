'use strict';

const mutations = `
  courseCreate(course: CourseCreateInput!): CourseMutationResponse!
  courseUpdate(course: CourseUpdateInput!): CourseMutationResponse!
  courseDelete(id: ID!): CourseMutationResponse!
  updateChapterOrder(id: ID!, chapterOrder: [Int!]!): CourseMutationResponse!
`;

module.exports = mutations;
