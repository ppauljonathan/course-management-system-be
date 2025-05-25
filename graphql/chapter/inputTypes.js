'use strict';

const chapterCreateInputType = `
  input ChapterCreateInput {
    title: String!
    content: String!
    course_id: ID!
  }
`;

const chapterUpdateInputType = `
  input chapterUpdateInput {
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
