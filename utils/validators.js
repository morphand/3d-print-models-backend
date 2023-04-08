// Models
const User = require("../models/User");

const constants = require("../constants");

/**
 * @param {String} username
 */
async function usernameExists(username) {
  const result = await User.find({ username });
  return Boolean(result.length);
}

/**
 * @param {String} email
 */
async function emailExists(email) {
  const result = await User.find({ email });
  return Boolean(result.length);
}

/**
 * @param {String} username
 */
function isValidUsername(username) {
  username = username.trim();
  if (
    username.length < constants.USERNAME_MIN_LENGTH ||
    username.length > constants.USERNAME_MAX_LENGTH
  ) {
    return false;
  }
  return true;
}

/**
 * @param {String} email
 */
function isValidEmail(email) {
  email = email.trim().toLowerCase();
  const regex = new RegExp(
    /^(?<address>[A-Za-z0-9_]{2,})@(?<subdomainOne>[A-Za-z0-9]{2,}\.)?(?<subdomainTwo>[A-Za-z0-9]{2,}\.)?(?<hostname>[A-Za-z0-9]{2,})\.(?<domain>[A-Za-z0-9]{2,})$/
  );
  if (
    email.length < constants.EMAIL_MIN_LENGTH ||
    email.length > constants.EMAIL_MAX_LENGTH ||
    !regex.test(email)
  ) {
    return false;
  }
  return true;
}

/**
 * @param {String} imageURL
 * @returns {Boolean}
 */
function isValidImageURL(imageURL) {
  imageURL = imageURL.trim();
  const regex = new RegExp(/^https?:\/\/.+\..+/, "i");
  if (!imageURL || !regex.test(imageURL)) {
    return false;
  }
  return true;
}

/**
 * @param {String} password
 */
function isValidPassword(password) {
  password = password.trim();
  if (
    password.length < constants.PASSWORD_MIN_LENGTH ||
    password.length > constants.PASSWORD_MAX_LENGTH
  ) {
    return false;
  }
  return true;
}

/**
 * @param {String} password
 * @param {String} repeatPassword
 */
function arePasswordsMatching(password, repeatPassword) {
  return password === repeatPassword;
}

module.exports = {
  usernameExists,
  emailExists,
  isValidUsername,
  isValidEmail,
  isValidImageURL,
  isValidPassword,
  arePasswordsMatching,
};
