const util = require("util");
const jsonwebtoken = require("jsonwebtoken");

const jwt = {
  decode: util.promisify(jsonwebtoken.decode),
  sign: util.promisify(jsonwebtoken.sign),
  verify: util.promisify(jsonwebtoken.verify),
};

module.exports = jwt;
