// Services
const authService = require("../services/auth");

// Utils
const Result = require("../utils/Result");
const validators = require("../utils/validators");

async function register(req, res) {
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const repeatPassword = req.body.repeatPassword.trim();
  const result = new Result();
  // Validators
  if (await validators.usernameExists(username)) {
    result.errors.push("This username already exists.");
    return res.json(result);
  }
  if (await validators.emailExists(email)) {
    result.errors.push("This email already exists.");
    return res.json(result);
  }
  if (!validators.isValidUsername(username)) {
    result.errors.push("Invalid username.");
    return res.json(result);
  }
  if (!validators.isValidEmail(email)) {
    result.errors.push("Invalid email.");
    return res.json(result);
  }
  if (!validators.isValidPassword(password)) {
    result.errors.push("Invalid password.");
    return res.json(result);
  }
  if (!validators.arePasswordsMatching(password, repeatPassword)) {
    result.errors.push("Password and repeat password do not match.");
    return res.json(result);
  }
  try {
    const token = await authService.register(username, email, password);
    result.status = true;
    result.value.token = token;
    result.value.username = username;
  } catch (e) {
    result.errors.push(e.message);
  } finally {
    return res.json(result);
  }
}

module.exports = register;
