'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { BCRYPT_SALT_ROUNDS, JWT_SECRET } = require('../constants');
const User = require('../models/user');

module.exports.signup = async (userData) => {
  const passwordErrors = validatePassword(userData);
  if (passwordErrors.length != 0) {
    return { errors: passwordErrors };
  }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  userData.password_hash = await bcrypt.hash(userData.password, salt);

  const { user, errors } = await User.create(userData);
  if (errors.length != 0) { return { errors }; }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  return { user, jwt: token, errors };
};

module.exports.login = async ({ email, password }) => {
  const user = await User.findByEmail(email);
  const errors = [];
  if(user === null) {
    errors.push({ status: 404, message: 'Email Not Found', location: 'email' })
    return { errors };
  }

  const passwordVerification = await bcrypt.compare(password, user.password_hash);
  if (!passwordVerification) {
    errors.push({ code: 401, message: 'incorrect password', location: 'password' });
    return { errors };
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  return { user, jwt: token, errors };
};

module.exports.generateResetPasswordToken = async ({ email }) => {
  const user = await User.findByEmail(email);

  if(user === null) {
    return {
      errors: [{ status: 404, message: 'Email Not Found', location: 'email' }]
    };
  }

  const { user: userWithResetToken, errors } = await User.generateResetPasswordToken(user.id);

  return {
    user: userWithResetToken,
    token: userWithResetToken?.reset_token,
    expires_at: userWithResetToken?.reset_token_expires_at,
    errors: errors
  }
};

module.exports.resetPassword = async (userData) => {
  const passwordErrors = validatePassword(userData);
  if (passwordErrors.length != 0) { return { errors: passwordErrors }; }

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  userData.password_hash = await bcrypt.hash(userData.password, salt);

  const { user, errors } = await User.resetPassword(userData);
  if (errors.length != 0) { return { errors }; }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  return { user, jwt: token, errors };
}

module.exports.getAuthenticatedUser = (context) => {
  if (!context.user) {
    const error = new Error('Unauthenticated');
    error.status = 401;
    throw error;
  }
  return context.user;
};

module.exports.ensureUserNotAuthenticated = (context) => {
  if (context.user) {
    const error = new Error('User is Already Authenticated');
    error.status = 403;
    throw error;
  }
};


module.exports.getUserFromToken = async(token) => {
  try {
    const { id, email } = jwt.verify(token, JWT_SECRET);
    let user = await User.find(id);
    if(user) { return user; }

    user = await User.findByEmail(email);
    if(user) { return user; }

    return null;
  } catch (err) {
    return null;
  }
}

const validatePassword = ({ password, password_confirmation }) => {
  const errors = [];

  if (password !== password_confirmation) {
    errors.push({ code: 422, message: 'passwords do not match', location: 'password' });
    errors.push({ code: 422, message: 'passwords do not match', location: 'password_confirmation' });
  }

  return errors;
}
