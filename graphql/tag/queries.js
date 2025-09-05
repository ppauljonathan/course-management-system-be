'use strict';

const queries = `
  tags(page: Int, per: Int, searchTerm: String): PaginationResponse!
  tag(id: ID): Tag
`;

module.exports = queries;
