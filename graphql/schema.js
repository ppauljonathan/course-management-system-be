'use strict';

const { buildSchema } = require('graphql');

const commonTypes = require('./common/types');

const courseTypes = require('./course/types');
const courseQueries = require('./course/queries');
const courseInputTypes = require('./course/inputTypes');
const courseMutations = require('./course/mutations');

const userTypes = require('./user/types');
const userQueries = require('./user/queries');
const userInputTypes = require('./user/inputTypes');
const userMutations = require('./user/mutations');

const types = `
  ${commonTypes}
  ${courseTypes}
  ${userTypes}
`;

const queries = `
  type Query {
    ${courseQueries}
    ${userQueries}
  }
`;

const inputTypes = `
  ${courseInputTypes}
  ${userInputTypes}
`;

const mutations = `
  type Mutation {
    ${courseMutations}
    ${userMutations}
  }
`;

const schemaString = types + queries + inputTypes + mutations;

// console.log("DEBUG MODE: SCHEMA: ", schemaString);

module.exports.schema = buildSchema(schemaString);
