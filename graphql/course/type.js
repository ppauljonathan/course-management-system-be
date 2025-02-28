'use strict';

module.exports.courseType = `
  type Course {
    id: ID!
    name: String!
    description: String
    price: Float!
    created_at: String!
    updated_at: String!
  }

  type CourseMutationResponse {
    course: Course
    userErrors: [UserError]
  }
`
