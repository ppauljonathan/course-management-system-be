'use strict';

const mutations = `
  chapterCreate(chapter: ChapterCreateInput!): ChapterMutationResponse!
  chapterUpdate(chapter: ChapterCreateInput!): ChapterMutationResponse!
  chapterDelete(id: ID!): ChapterMutationResponse!
`;

module.exports = mutations;
