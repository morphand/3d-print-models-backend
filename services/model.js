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
    .sort({ dateFeatured: -1 })
    .lean();
  return result;
}

function getModelFiles(modelPath) {
  modelPath = modelPath.replace("./", "");
  const modelDirContent = fs.readdirSync(modelPath);
  const modelFiles = modelDirContent
    .filter(
      (file) =>
        file.endsWith(".stl") || file.endsWith(".obj") || file.endsWith(".3mf")
    )
    .map(
      (fileName) =>
        (fileName = `http://localhost:5000/${modelPath}/${fileName}`)
    );
  return modelFiles;
}

function getModelImages(modelPath) {
  modelPath = modelPath.replace("./", "");
  const modelImagesContent = fs.readdirSync(`${modelPath}/images`);
  const modelImages = modelImagesContent.map(
    (fileName) =>
      (fileName = `http://localhost:5000/${modelPath}/images/${fileName}`)
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

async function getModelCreator(modelId) {
  const model = await getModelById(modelId);
  return model.creator;
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

async function isUserModelCreator(modelId, userId) {
  const model = await getModelById(modelId);
  if (model.creator._id.toString() === userId) {
    return true;
  }
  return false;
}

async function deleteModel(modelId) {
  // Delete model.
  const deletedModel = await Model.findByIdAndDelete(modelId);

  // Get creator id from the deleted model.
  const creatorId = deletedModel.creator._id.toString();

  // Remove the entry from the users that liked the model.
  const usersLikedModel = deletedModel.usersLikedModel;
  for (const userId of usersLikedModel) {
    await User.findByIdAndUpdate(userId, {
      $pull: { likedModels: modelId },
    });
  }

  // Remove model from the users' uploaded models.
  await User.findByIdAndUpdate(creatorId, {
    $pull: { uploadedModels: modelId },
  });

  return deletedModel;
}

async function featureModel(modelId) {
  const featuredModel = await Model.findByIdAndUpdate(modelId, {
    isFeatured: true,
    dateFeatured: Date.now(),
  });
  return featuredModel;
}

async function removeFeatureModel(modelId) {
  const featuredModel = await Model.findByIdAndUpdate(modelId, {
    isFeatured: false,
  });
  return featuredModel;
}

async function dislikeModel(modelId, userId) {
  const user = await User.findByIdAndUpdate(userId, {
    $pull: { likedModels: modelId },
  });
  const model = await Model.findByIdAndUpdate(modelId, {
    $pull: { usersLikedModel: userId },
    $inc: { likesCount: -1 },
  });
  return user;
}

async function incrementDownloadCount(modelId) {
  const model = await Model.findByIdAndUpdate(modelId, {
    $inc: { downloadsCount: +1 },
  });
  return model;
}

async function editModel(modelId, modelName, modelDescription) {
  const model = await Model.findByIdAndUpdate(modelId, {
    $set: {
      name: modelName,
      description: modelDescription,
      dateLastModified: Date.now(),
    },
  });
  return model;
}

async function deleteComment(modelId, commentId, isUserAdmin) {
  if (isUserAdmin) {
    const comment = await Comment.findByIdAndDelete(commentId);
    const model = await Model.findByIdAndUpdate(modelId, {
      $pull: { comments: commentId },
      $inc: { commentsCount: -1 },
    });
    return model;
  }
  return null;
}

async function searchModel(searchTerm) {
  const regex = new RegExp(searchTerm, "gi");
  const models = await Model.find({ name: { $regex: regex } })
    .populate("creator")
    .lean();
  for (const model of models) {
    const modelFiles = getModelFiles(model.path);
    const modelImages = getModelImages(model.path);
    model.files = modelFiles;
    model.images = modelImages;
  }
  return models;
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
  getModelCreator,
  likeModel,
  isUserModelCreator,
  deleteModel,
  featureModel,
  removeFeatureModel,
  dislikeModel,
  incrementDownloadCount,
  editModel,
  deleteComment,
  searchModel,
};

module.exports = modelService;
