const config = require('config');
const jwt = require("jsonwebtoken");

const generateAccessToken = (email, id) => {
  // expires after half and hour (3600 seconds = 60 minutes)
  const payload = {email, id}
  return jwt.sign(payload, config.get("TOKEN_SECRET"), { expiresIn: '1h' });
}

module.exports = {
  generateAccessToken
}