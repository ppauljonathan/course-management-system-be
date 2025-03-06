'use strict';

const userType = `
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    created_at: String!
    updated_at: String!
  }
`;

const userWithJWTType = `
  type UserWithJWT {
    user: User
    jwt: String
    errors: [Error]
  }
`;

const userWithResetTokenType = `
  type UserWithResetToken {
    user: User
    token: String
    expires_at: String
    errors: [Error]
  }
`;

const types =
  userType +
  userWithJWTType +
  userWithResetTokenType
;

module.exports = types;
