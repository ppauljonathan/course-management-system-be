'use strict';

const courseType = `
  type Course {
    id: ID!
    name: String!
    description: String
    price: Float!
    created_at: String!
    updated_at: String!
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
