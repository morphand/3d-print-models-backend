const mongoose = require("mongoose");

const ModelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, "The model's name has to be more than 2 characters long."],
    maxLength: [45, "The model's name has to be less than 45 characters long."],
  },
  description: {
    type: String,
    minLength: 0,
    maxLength: [
      2000,
      "The model's description has to be less than 2000 characters long.",
    ],
  },
  path: {
    type: String,
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
  usersLikedModel: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateUploaded: {
    type: Date,
    default: Date.now,
  },
  dateLastModified: {
    type: Date,
    default: Date.now,
  },
});

const ModelModel = mongoose.model("Model", ModelSchema);

module.exports = ModelModel;
