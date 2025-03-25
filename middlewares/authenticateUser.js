const { getUserFromToken } = require('../services/auth');

module.exports.authenticateUser = async (req, _res, next) => {
	const authHeader = req.headers['authorization'];
	if(authHeader === undefined || !authHeader) { return next(); }

	const token = authHeader.split(' ')[1];
	if(token === undefined || !token) { return next(); }

	const user = await getUserFromToken(token);
	if(user === null) { return next(); }

	req.user = user;

	next();
};
