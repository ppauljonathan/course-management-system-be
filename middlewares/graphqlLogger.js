require('dotenv').configDotenv();

module.exports.graphqlLogger = (req, res, next) => {
  if (req.method === 'POST' && req.body && req.body.query) {
        console.log('--- GraphQL Request ---');
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log(`Query: ${req.body.query}`);
        if (req.body.variables) {
            console.log(`Variables: ${JSON.stringify(req.body.variables, null, 2)}`);
        }

        if(process.env.LOG_LEVEL == 3) {
          console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
        }
        console.log('----------------------');
    }
  next();
}
