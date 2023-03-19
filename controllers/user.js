const User = require("../models/User");

async function user(req, res) {
  const userId = req.params.id;
  const user = await getOne(userId);
  return res.json(user);
}

async function getOne(userId) {
  const user = await User.findById(userId)
    // Remove the password field from the result
    .select("-password")
    // Remove the email field from the result
    .select("-email")
    .populate()
    .lean();
  return user;
}

module.exports = user;
