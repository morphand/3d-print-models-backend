const fs = require("fs");

// Models
const Model = require("../models/Model");
const Comment = require("../models/Comment");
const User = require("../models/User");

async function getModelById(modelId) {
  const result = await Model.findById(modelId)
    .populate("creator")
    .populate("comments")
    .lean();
  return result;
}

async function getNModels(numberOfModels) {
  const result = await Model.find({})
    .limit(numberOfModels)
    .populate("creator")
    .populate("comments")
    .lean();
  return result;
}

async function getAllModels() {
  const result = await Model.find({})
    .populate("creator")
    .populate("comments")
    .lean();
  return result;
}

async function getFeaturedModels() {
  const result = await Model.find({ isFeatured: true })
    .limit(4)
    .populate("creator")
    .populate("comments")
    .lean();
  return result;
}

function getModelFiles(creatorId, modelName) {
  const modelDirContent = fs.readdirSync(`./uploads/${creatorId}/${modelName}`);
  const modelFiles = modelDirContent
    .filter(
      (file) =>
        file.endsWith(".stl") || file.endsWith(".obj") || file.endsWith(".3mf")
    )
    .map(
      (fileName) =>
        (fileName = `http://localhost:5000/uploads/${creatorId}/${modelName}/${fileName}`)
    );
  return modelFiles;
}

function getModelImages(creatorId, modelName) {
  const modelImagesContent = fs.readdirSync(
    `./uploads/${creatorId}/${modelName}/images`
  );
  const modelImages = modelImagesContent.map(
    (fileName) =>
      (fileName = `http://localhost:5000/uploads/${creatorId}/${modelName}/images/${fileName}`)
  );
  return modelImages;
}

async function addCommentToModel(modelId, comment, creatorUsername) {
  const model = await Model.findById(modelId);

  // Comment
  const commentToInsert = new Comment({
    creatorId: model.creator._id,
    creatorUsername: creatorUsername,
    modelCommented: modelId,
    comment: comment,
  });

  // Save comment
  const insertedComment = await commentToInsert.save();

  model.commentsCount++;
  model.comments.push(insertedComment._id);
  await model.save();
}

async function getModelComments(modelId) {
  const comments = await Model.findById(modelId)
    .select("-_id comments")
    .populate("comments")
    .lean();
  return comments;
}

async function likeModel(modelId, userId) {
  const user = await User.findById(userId);
  const model = await Model.findById(modelId);
  user.likedModels.push(model._id);
  model.likesCount++;
  model.usersLikedModel.push(user._id);
  await user.save();
  await model.save();
  return user;
}

const modelService = {
  getModelById,
  getNModels,
  getAllModels,
  getFeaturedModels,
  getModelFiles,
  getModelImages,
  addCommentToModel,
  getModelComments,
  likeModel,
};

module.exports = modelService;
