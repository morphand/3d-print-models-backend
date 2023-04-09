// Modules
const bcrypt = require("bcrypt");

// Models
const User = require("../models/User");

// Services
const authService = require("./auth");
const modelService = require("./model");

// Utils
const validators = require("../utils/validators");
const Result = require("../utils/Result");

// Constants
const constants = require("../constants");

async function getOne(
  userId,
  options = { excludePassword: true, excludeEmail: true, excludeIsAdmin: true }
) {
  let query = [];
  if (options.excludePassword) {
    query.push("-password");
  }
  if (options.excludeEmail) {
    query.push("-email");
  }
  if (options.excludeIsAdmin) {
    query.push("-isAdmin");
  }
  const user = await User.findById(userId)
    .select(query.join(" "))
    .populate("uploadedModels")
    .lean();
  return user;
}

async function editUser(
  currentUserId,
  editedUserId,
  email,
  imageURL,
  password,
  repeatPassword
) {
  const isCurrentUserAdmin = await authService.isUserAdmin(currentUserId);
  const result = new Result();
  if (currentUserId !== editedUserId && !isCurrentUserAdmin) {
    result.errors.push("You are not allowed to edit this user profile.");
    return result;
  }
  const isValidEmail = validators.isValidEmail(email);
  const isValidImageURL = validators.isValidImageURL(imageURL);
  const isValidPassword = validators.isValidPassword(password);
  const arePasswordsMatching = validators.arePasswordsMatching(
    password,
    repeatPassword
  );
  const emailExists = await validators.emailExists(email);
  if (
    !isValidEmail ||
    emailExists ||
    !isValidImageURL ||
    !isValidPassword ||
    !arePasswordsMatching
  ) {
    if (!isValidEmail) {
      result.errors.push("Invalid email.");
    }
    if (emailExists) {
      result.errors.push("This email already exists.");
    }
    if (!isValidImageURL) {
      result.errors.push("Invalid image URL.");
    }
    if (!isValidPassword) {
      result.errors.push("Invalid password");
    }
    if (!arePasswordsMatching) {
      result.errors.push("Password and repeat password must match.");
    }
    return result;
  }

  const user = await User.findByIdAndUpdate(editedUserId, {
    $set: {
      email: email,
      imageURL: imageURL,
      password: await bcrypt.hash(password, constants.BCRYPT_SALT_ROUNDS),
    },
  });

  result.status = true;
  result.value = user;
  return result;
}

async function getUserModels(userId) {
  const user = await getOne(userId);
  const uploadedModels = user.uploadedModels;
  for (const model of uploadedModels) {
    model.creator = await modelService.getModelCreator(model._id);
    const modelFiles = modelService.getModelFiles(model.path);
    const modelImages = modelService.getModelImages(model.path);
    model.files = modelFiles;
    model.images = modelImages;
  }
  return uploadedModels;
}

async function getUserForEdit(userId) {
  const user = await getOne(userId, { excludeEmail: false });
  return user;
}

const userService = {
  getOne,
  editUser,
  getUserModels,
  getUserForEdit,
};

module.exports = userService;
