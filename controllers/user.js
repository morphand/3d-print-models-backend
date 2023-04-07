const userService = require("../services/user");

async function getUser(req, res) {
  const userId = req.params.id;
  const user = await userService.getOne(userId);
  return res.json(user);
}

async function postEditUser(req, res) {
  const currentUserId = req.body.currentUserId;
  const editedUserId = req.body.editedUserId;
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const repeatPassword = req.body.repeatPassword.trim();
  const result = await userService.editUser(
    currentUserId,
    editedUserId,
    email,
    password,
    repeatPassword
  );
  return result;
}

async function getUserModels(req, res) {
  const userId = req.params.id;
  const models = await userService.getUserModels(userId);
  return res.json(models);
}

const userController = {
  getUser,
  postEditUser,
  getUserModels,
};

module.exports = userController;
