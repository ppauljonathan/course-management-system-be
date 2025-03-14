'use strict';

const AuthService = require('../../services/auth');

const signup = async ({ input }, context) => {
  AuthService.ensureUserNotAuthenticated(context);
  return await AuthService.signup(input);
};

const login = async ({ input }, context) => {
  AuthService.ensureUserNotAuthenticated(context);
  return await AuthService.login(input);
};

const requestPasswordReset = async({ input }, context) => {
  AuthService.ensureUserNotAuthenticated(context);

  return await AuthService.generateResetPasswordToken(input);
}

const resetPassword = async({ input }, context) => {
  AuthService.ensureUserNotAuthenticated(context);

  return await AuthService.resetPassword(input);
}

const me = (_inp, context) => {
  return context.user
}

const resolvers = { signup, login, requestPasswordReset, resetPassword, me };

module.exports = resolvers;
