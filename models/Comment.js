const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  modelCommented: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model",
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
