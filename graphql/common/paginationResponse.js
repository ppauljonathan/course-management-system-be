'use strict';

module.exports.pageInfoType = `
  type PageInfo {
    page: Int!
    per: Int!
    totalPages: Int
    totalRecords: Int
  }
`;

module.exports.paginationResponseType = `
  type PaginationResponse {
    courses: [Course]
    pageInfo: PageInfo!
  }
`;
