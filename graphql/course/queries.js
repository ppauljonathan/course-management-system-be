'use strict';

const queries = `
  courses(page: Int, per: Int): PaginationResponse!
  course(id: ID!): Course
`;

module.exports = queries;
