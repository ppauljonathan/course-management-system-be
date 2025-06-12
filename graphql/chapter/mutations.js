'use strict';

const mutations = `
  chapterCreate(chapter: ChapterCreateInput!): ChapterMutationResponse!
  chapterUpdate(chapter: ChapterUpdateInput!): ChapterMutationResponse!
  chapterDelete(id: ID!, courseId: ID!): ChapterMutationResponse!
`;

module.exports = mutations;
