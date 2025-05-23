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

const chapterTypes = require('./chapter/types');
const chapterQueries = require('./chapter/queries');
const chapterInputTypes = require('./chapter/inputTypes');
const chapterMutations = require('./chapter/mutations');

const types = `
  ${commonTypes}
  ${courseTypes}
  ${userTypes}
  ${chapterTypes}
`;

const queries = `
  type Query {
    ${courseQueries}
    ${userQueries}
    ${chapterQueries}
  }
`;

const inputTypes = `
  ${courseInputTypes}
  ${userInputTypes}
  ${chapterInputTypes}
`;

const mutations = `
  type Mutation {
    ${courseMutations}
    ${userMutations}
    ${chapterMutations}
  }
`;

const schemaString = types + queries + inputTypes + mutations;

// console.log("DEBUG MODE: SCHEMA: ", schemaString);

module.exports.schema = buildSchema(schemaString);
