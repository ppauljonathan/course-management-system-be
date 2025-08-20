'use strict';

const queries = `
  me: User
  users(page: Int, per: Int, searchTerm: String): PaginationResponse!
  usersByIds(page: Int, per: Int, ids: [Int!]!): PaginationResponse!
`;

module.exports = queries;
