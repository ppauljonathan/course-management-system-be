'use strict';

const mutations = `
    signup(input: SignupInput!): UserWithJWT!
    login(input: LoginInput!): UserWithJWT!
    requestPasswordReset(input: RequestPasswordResetInput!): UserWithResetToken!
    resetPassword(input: ResetPasswordInput!): UserWithJWT!
`;

module.exports = mutations;
