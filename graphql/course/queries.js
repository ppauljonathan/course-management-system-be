'use strict';

const queries = `
  courses(page: Int, per: Int, searchTerm: String): PaginationResponse!
  createdCourses(page: Int, per: Int, searchTerm: String): PaginationResponse!
  course(id: ID!): Course
`;

module.exports = queries;
