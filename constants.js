require('dotenv').configDotenv();

module.exports.PORT = process.env.PORT || 3000;
module.exports.PER_PAGE = 50;
module.exports.MAX_PER_PAGE = 250;
module.exports.DEFAULT_PAGE = 1;
module.exports.BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
module.exports.JWT_SECRET = process.env.JWT_SECRET;
module.exports.RESET_TOKEN_LENGTH = process.env.RESET_TOKEN_LENGTH || 16;
module.exports.RESET_TOKEN_EXPIRY_IN_HOURS = 8;
module.exports.EMAIL_REGEX =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
