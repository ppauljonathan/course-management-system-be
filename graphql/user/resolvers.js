'use strict';

const {
  signup: userSignup,
  login: userLogin,
  ensureUserNotAuthenticated
} = require('../../services/auth');

const signup = async ({ input }, context) => {
  ensureUserNotAuthenticated(context);
  return await userSignup(input);
};

const login = async ({ input }, context) => {
  ensureUserNotAuthenticated(context);
  return await userLogin(input);
};

const resolvers = { signup, login };

module.exports = resolvers;
