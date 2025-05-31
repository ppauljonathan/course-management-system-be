'use strict';

const queries = `
  chapters(courseId: ID!, page: Int, per: Int): PaginationResponse!
  chapter(id: ID!): Chapter
`;

module.exports = queries;
