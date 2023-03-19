const mongoose = require("mongoose");

const ModelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, "The model's name has to be more than 2 characters long."],
    maxLength: [
      100,
      "The model's name has to be less than 100 characters long.",
    ],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  downloadsCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  likesCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  commentsCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const ModelModel = mongoose.model("Model", ModelSchema);

module.exports = ModelModel;
