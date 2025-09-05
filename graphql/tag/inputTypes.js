'use strict';

const tagCreateInputType = `
  input TagCreateInput {
    name: String!,
    description: String!,
  }
`;

const tagUpdateInputType = `
  input TagUpdateInput {
    id: ID!,
    name: String!,
    description: String!,
  }
`;

const inputTypes =
  tagCreateInputType +
  tagUpdateInputType;

module.exports = inputTypes;
