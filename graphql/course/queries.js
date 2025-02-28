'use strict';

module.exports.courseQueries = `
  courses(page: Int, per: Int): PaginationResponse!
  course(id: ID!): Course
`;
