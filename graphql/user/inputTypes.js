'use strict';

const signupInputType = `
  input SignupInput {
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    password_confirmation: String!
  }
`;

const loginInputType = `
  input LoginInput {
    email: String!
    password: String!
  }
`;

const inputTypes =
  signupInputType +
  loginInputType
;

module.exports = inputTypes;
