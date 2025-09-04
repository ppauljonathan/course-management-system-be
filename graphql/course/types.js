'use strict';

const courseType = `
  type Course {
    id: ID!
    name: String!
    description: String
    created_at: String!
    updated_at: String!
    live: Boolean!
    user: User
    chapter_order: [ID]
    tags: [TagType]
  }
`;

const courseMutationResponseType = `
  type CourseMutationResponse {
    course: Course
    errors: [Error]
  }
`;

const tagType = `
  type TagType {
    id: ID!,
    name: String,
    description: String,
  }
`



const types =
  courseType +
  courseMutationResponseType +
  tagType
  ;

module.exports = types;
