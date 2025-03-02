'use strict';

const courseResolvers = require('./course/resolvers');
const userResolvers = require('./user/resolvers');

module.exports.rootValue = {
	...courseResolvers,
	...userResolvers
};
