'use strict';

const chapterType = `
  type Chapter {
    id: ID!
    title: String!
    content: String!
    created_at: String!
    updated_at: String!
    course: Course
  }
`;

const chapterMutationResponseType = `
  type ChapterMutationResponse {
    chapter: Chapter
    errors: [Error]
  }
`

const types =
  chapterType +
  chapterMutationResponseType
;
module.exports = types;
