'use strict';

const { buildSchema } = require('graphql');

const { pageInfoType, paginationResponseType } = require('./common/paginationResponse');
const { userErrorType } = require('./common/userError');

const { courseType } = require('./course/type');
const { courseQueries } = require('./course/queries');
const { courseMutations } = require('./course/mutations');

const types = `
  ${pageInfoType}
  ${userErrorType}
  ${paginationResponseType}
  ${courseType}
`

const queries = `
  type Query {
    ${courseQueries}
  }
`

const mutations = `
  type Mutation {
    ${courseMutations}
  }
`

const schemaString = types + queries + mutations

module.exports.schema = buildSchema(schemaString);
