'use strict';

const mutations = `
  tagCreate(tag: TagCreateInput!): TagMutationResponse!
  tagUpdate(tag: TagUpdateInput!): TagMutationResponse!
  tagDelete(id: ID!): TagMutationResponse!
`;

module.exports = mutations;
