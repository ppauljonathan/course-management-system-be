const app = require('../server');
const db = require('../config/database');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await db.connect();
    isConnected = true;
    console.log("Connected to DB (serverless)");
  }
  return app(req, res);
};
