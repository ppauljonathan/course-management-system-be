'use strict';

const queries = `
  me: User
  users(page: Int, per: Int, searchTerm: String): PaginationResponse!
`;

module.exports = queries;
