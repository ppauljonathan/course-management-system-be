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

const requestPasswordResetInputType = `
  input RequestPasswordResetInput {
    email: String!
  }
`;

const resetPasswordInputType = `
  input ResetPasswordInput {
    token: String!
    password: String!
    password_confirmation: String!
  }
`;

const inputTypes =
  signupInputType +
  loginInputType +
  requestPasswordResetInputType +
  resetPasswordInputType
;

module.exports = inputTypes;
