'use strict';

module.exports.context = (req) => {
  return { user: req.raw.user };
}
