'use strict';

const chapterCreateInputType = `
  input ChapterCreateInput {
    title: String!
    content: String!
    courseId: ID!
  }
`;

const chapterUpdateInputType = `
  input ChapterUpdateInput {
    id: ID!
    title: String!
    content: String!
  }
`;

const inputTypes =
  chapterCreateInputType +
  chapterUpdateInputType
;

module.exports = inputTypes;
