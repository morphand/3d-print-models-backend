// Services
const authService = require("../services/auth");

// Utils
const Result = require("../utils/Result");
const validators = require("../utils/validators");

async function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const result = new Result();
  if (!validators.isValidUsername(username)) {
    result.errors.push("Invalid username.");
    return res.json(result);
  }
  if (!(await validators.usernameExists(username))) {
    result.errors.push("This username does not exist.");
    return res.json(result);
  }
  if (!validators.isValidPassword(password)) {
    result.errors.push("Invalid password.");
    return res.json(result);
  }
  try {
    const token = await authService.login(username, password);
    result.status = true;
    result.value.token = token;
    result.value.username = username;
  } catch (e) {
    result.errors.push(e.message);
  } finally {
    return res.json(result);
  }
}

module.exports = login;
