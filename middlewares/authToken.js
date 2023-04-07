// Utils
const jwt = require("../utils/jwt");

// Services
const authService = require("../services/auth");

// Constants
const { JWT_SECRET } = require("../constants");

async function requiresToken(req, res, next) {
  let token = req.headers.authentication;
  if (token) {
    token = token.replace("Bearer: ", "");
    const decodedToken = await jwt.verify(token, JWT_SECRET);
    const userId = decodedToken._id;
    const username = decodedToken.username;
    const isUserAdmin = await authService.isUserAdmin(userId);
    req.token = { userId, username, isUserAdmin };
  }
  return next();
}

module.exports = requiresToken;
