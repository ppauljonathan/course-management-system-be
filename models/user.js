'use strict';

const { uid } = require('rand-token');
const { addHours } = require('date-fns');

const db = require('../config/database');
const { PER_PAGE, RESET_TOKEN_LENGTH, RESET_TOKEN_EXPIRY_IN_HOURS } = require('../constants');
const { calculateCurrentTime } = require('./concerns/time');
const { findWithPagination } = require('./concerns/pagination');
const { userCreationValidator } = require('../validators/user');
const { dbLogger } = require('../services/db');

module.exports.findAll = async (page = 1, per = PER_PAGE, searchTerm = null) => {
  let searchQuery = `
    deleted_at IS NULL
  `;
  const searchVariables = [];

  if (searchTerm) {
    searchQuery += ` AND
      (
        first_name ILIKE $1 OR
        last_name ILIKE $1 OR
        email ILIKE $1
      )
    `;
    searchVariables.push(`%${searchTerm}%`);
  }

  return findWithPagination(
    'users',
    searchQuery,
    searchVariables,
    page,
    per
  );
};

module.exports.findByIds = async (ids, page = 1, per = PER_PAGE) => {
  let searchQuery = `
    id = ANY($1) AND
    deleted_at IS NULL
  `;
  const searchVariables = [ids];

  return findWithPagination(
    'users',
    searchQuery,
    searchVariables,
    page,
    per
  );
}

module.exports.find = async (id) => {
  const query = `
    SELECT * FROM users
    WHERE id = $1 AND deleted_at IS NULL
  `;
  const variables = [id];

  dbLogger(query, variables, 'Find User');

  const result = await db.query(query, variables);
  return result.rows[0] || null;
};

module.exports.findByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE email = $1 AND deleted_at IS NULL
  `;
  const variables = [email]

  dbLogger(query, variables, 'Find User by Email');

  const result = await db.query(query, variables);
  return result.rows[0] || null;
}

module.exports.findByResetToken = async (token) => {
  const query = `
    SELECT * FROM users
    WHERE reset_token = $1
    AND reset_token_expires_at > NOW()
    AND deleted_at IS NULL
  `;
  const variables = [token];

  dbLogger(query, variables, 'Find User by reset token');

  const result = await db.query(query, variables);
  return result.rows[0] || null;
}

module.exports.create = async (userData) => {
  const errors = await userCreationValidator(userData);
  if (errors.length != 0) { return { errors }; }

  const currentTime = calculateCurrentTime();

  const query = `
    INSERT INTO users (first_name, last_name, email, password_hash, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const variables = [
    userData.first_name,
    userData.last_name,
    userData.email,
    userData.password_hash,
    currentTime,
    currentTime
  ];

  dbLogger(query, variables, 'Create user');

  const result = await db.query(query, variables);
  const user = result.rows[0]

  return { user, errors: [] };
}

module.exports.generateResetPasswordToken = async (id) => {
  const currentTime = calculateCurrentTime();
  const resetTokenExpiresAt = addHours(currentTime, RESET_TOKEN_EXPIRY_IN_HOURS);
  const resetToken = uid(RESET_TOKEN_LENGTH);

  const query = `
    UPDATE users
    SET reset_token = $1, reset_token_expires_at = $2, updated_at = $3
    WHERE id = $4 AND deleted_at IS NULL
    RETURNING *
  `;
  const variables = [resetToken, resetTokenExpiresAt, currentTime, id];

  dbLogger(query, variables, 'generate Reset Password Token');

  const result = await db.query(query, variables);

  const user = result.rows[0] || null;

  return { user, errors: [] };
}

module.exports.resetPassword = async (userData) => {
  const user = await this.findByResetToken(userData.token);
  const errors = [];
  if (!user) {
    errors.push({
      code: 404,
      message: "unable to find user with reset token",
      location: 'token'
    });
    return { errors };
  }

  const currentTime = calculateCurrentTime();
  if (user.reset_token_expires_at < currentTime) {
    errors.push({
      code: 422,
      message: "Reset Token has expired",
      location: 'token'
    });
    return { errors };
  }

  const query = `
    UPDATE users
    SET password_hash = $1, reset_token = $2, reset_token_expires_at = $3, updated_at = $4
    WHERE id = $5 AND deleted_at IS NULL
    returning *
  `
  const variables = [userData.password_hash, null, null, currentTime, user.id];

  dbLogger(query, variables, 'Set New Password');

  const result = await db.query(query, variables);
  const updatedUser = result.rows[0];

  return { user: updatedUser, errors };
};
