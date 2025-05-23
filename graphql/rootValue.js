'use strict';

const courseResolvers = require('./course/resolvers');
const userResolvers = require('./user/resolvers');
const chapterResolvers = require('./chapter/resolvers');

module.exports.rootValue = {
	...courseResolvers,
	...userResolvers,
  ...chapterResolvers
};
