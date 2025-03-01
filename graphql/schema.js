'use strict';

const { buildSchema } = require('graphql');

const commonTypes = require('./common/types');

const courseTypes = require('./course/types');
const courseQueries = require('./course/queries');
const courseInputTypes = require('./course/inputTypes');
const courseMutations = require('./course/mutations');

const types = `
  ${commonTypes}
  ${courseTypes}
`

const queries = `
  type Query {
    ${courseQueries}
  }
`

const inputTypes = `
  ${courseInputTypes}
`

const mutations = `
  type Mutation {
    ${courseMutations}
  }
`

const schemaString = types + queries + inputTypes + mutations;

module.exports.schema = buildSchema(schemaString);
