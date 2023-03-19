// Modules
const bcrypt = require("bcrypt");

// Models
const User = require("../models/User");

// Utils
const jwt = require("../utils/jwt");

// Constants
const constants = require("../constants");

/**
 * @param {String} username
 * @param {String} email
 * @param {String} password
 */
async function register(username, email, password) {
  try {
    // Save the created user
    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, constants.BCRYPT_SALT_ROUNDS),
    });
    const userResult = await user.save();
    // Create token
    const token = await createToken(userResult._id, userResult.username);
    return token;
  } catch (e) {
    throw e;
  }
}

async function login(username, password) {
  try {
    const userResult = await User.findOne({ username });
    const isCorrectPassword = await bcrypt.compare(
      password,
      userResult.password
    );
    if (!isCorrectPassword) {
      throw new Error("The password is not correct.");
    }
    // Create token
    const token = await createToken(userResult._id, userResult.username);
    return token;
  } catch (e) {
    throw e;
  }
}

async function createToken(_id, username) {
  try {
    const token = await jwt.sign(
      {
        _id,
        username,
      },
      constants.JWT_SECRET
    );
    return token;
  } catch (e) {
    throw e;
  }
}

module.exports = { register, login };
