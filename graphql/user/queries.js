'use strict';

const queries = `
  me: User
  users(page: Int, per: Int, searchTerm: String): PaginationResponse!
  usersByIds(page: Int, per: Int, ids: [String!]!): PaginationResponse!
`;

module.exports = queries;
