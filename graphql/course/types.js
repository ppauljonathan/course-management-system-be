'use strict';

const courseType = `
  type Course {
    id: ID!
    name: String!
    description: String
    price: Float!
    created_at: String!
    updated_at: String!
    live: Boolean!
    user: User
  }
`;

const courseMutationResponseType = `
  type CourseMutationResponse {
    course: Course
    errors: [Error]
  }
`;



const types =
  courseType +
  courseMutationResponseType
;

module.exports = types;
