'use strict';

const mutations = `
    signup(input: SignupInput!): UserWithJWT!
    login(input: LoginInput!): UserWithJWT!
`;

module.exports = mutations;
