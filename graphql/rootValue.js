'use strict';

const courseResolvers = require('./course/resolvers');

module.exports.rootValue = {
...courseResolvers
}
