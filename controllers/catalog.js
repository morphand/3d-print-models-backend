// Services
const modelService = require("../services/model");
const authService = require("../services/auth");

// Models
const Result = require("../utils/Result");

async function getAll(req, res) {
  const models = await modelService.getAllModels();
  models.map((model) => {
    const modelFiles = modelService.getModelFiles(model.path);
    const modelImages = modelService.getModelImages(model.path);
    model.files = modelFiles;
    model.images = modelImages;
  });
  return res.json(models);
}

async function getFeaturedModels(req, res) {
  const featuredModels = await modelService.getFeaturedModels();
  featuredModels.map((model) => {
    const modelFiles = modelService.getModelFiles(model.path);
    const modelImages = modelService.getModelImages(model.path);
    model.files = modelFiles;
    model.images = modelImages;
  });
  return res.json(featuredModels);
}

async function getModel(req, res) {
  const modelId = req.params.id;
  const model = await modelService.getModelById(modelId);
  const creatorId = model.creator._id.toString();
  const modelFiles = modelService.getModelFiles(model.path);
  const modelImages = modelService.getModelImages(model.path);
  model.files = modelFiles;
  model.images = modelImages;
  return res.json(model);
}

async function addCommentToModel(req, res) {
  const modelId = req.params.id;
  const comment = req.body.comment;
  const creatorUsername = req.body.creatorUsername;
  const model = await modelService.addCommentToModel(
    modelId,
    comment,
    creatorUsername
  );
  return res.json(true);
}

async function getModelComments(req, res) {
  const modelId = req.params.id;
  const comments = await modelService.getModelComments(modelId);
  return res.json(comments);
}

async function postLikeModel(req, res) {
  const modelId = req.params.id;
  const result = new Result();
  if (!req.token) {
    result.errors.push("You need to be logged in to like this model.");
    return res.json(result);
  }
  const userId = req.token.userId;
  const model = await modelService.likeModel(modelId, userId);
  return res.json(model);
}

async function deleteModel(req, res) {
  const modelId = req.params.id;
  const result = new Result();
  if (!req.token) {
    result.errors.push("You are not the model creator.");
    return res.json(result);
  }
  const userId = req.token.userId;
  const isUserModelCreator = await modelService.isUserModelCreator(
    modelId,
    userId
  );
  const isUserAdmin = await authService.isUserAdmin(userId);
  if (!isUserAdmin) {
    if (!isUserModelCreator) {
      result.errors.push("You are not the model creator.");
      return res.json(result);
    }
  }
  const deletedModel = await modelService.deleteModel(modelId);
  result.status = true;
  result.value = deletedModel;
  return res.json(result);
}

async function postFeatureModel(req, res) {
  const modelId = req.params.id;
  const result = new Result();
  if (!req.token) {
    result.errors.push("You need to be an admin to feature this model.");
    return res.json(result);
  }
  const userId = req.token.userId;
  const isUserAdmin = await authService.isUserAdmin(userId);
  if (isUserAdmin) {
    const featuredModel = await modelService.featureModel(modelId);
    result.status = true;
    result.value = featuredModel;
  }
  return res.json(result);
}

async function postRemoveFeatureModel(req, res) {
  const modelId = req.params.id;
  const result = new Result();
  if (!req.token) {
    result.errors.push(
      "You need to be an admin to remove the feature from this model."
    );
    return res.json(result);
  }
  const userId = req.token.userId;
  const isUserAdmin = await authService.isUserAdmin(userId);
  if (isUserAdmin) {
    const featuredModel = await modelService.removeFeatureModel(modelId);
    result.status = true;
    result.value = featuredModel;
  }
  return res.json(result);
}

async function postDislikeModel(req, res) {
  const modelId = req.params.id;
  const result = new Result();
  if (!req.token) {
    result.errors.push("You need to be logged in to dislike this model.");
    return res.json(result);
  }
  const userId = req.token.userId;
  const model = await modelService.dislikeModel(modelId, userId);
  result.status = true;
  result.value = model;
  return res.json(result);
}

async function postDownloadModel(req, res) {
  const modelId = req.params.id;
  const model = await modelService.incrementDownloadCount(modelId);
  return res.json(model);
}

async function postEditModel(req, res) {
  const modelId = req.params.id;
  const creatorId = req.body.creatorId;
  const modelName = req.body.modelName;
  const modelDescription = req.body.modelDescription;
  const result = new Result();
  const model = await modelService.editModel(
    modelId,
    modelName,
    modelDescription
  );
  result.status = true;
  result.value = model;
  return res.json(result);
}

async function deleteComment(req, res) {
  const modelId = req.params.id;
  const commentId = req.body.commentId;
  const result = new Result();
  if (!req.token) {
    result.errors.push("You are not the comment creator.");
    return res.json(result);
  }
  const isUserAdmin = req.token.isUserAdmin;
  const comment = await modelService.deleteComment(
    modelId,
    commentId,
    isUserAdmin
  );
  if (comment) {
    result.status = true;
    result.value = comment;
    return res.json(result);
  }
  return res.json(result);
}

async function postSearchModel(req, res) {
  const searchTerm = req.body.searchTerm;
  const models = await modelService.searchModel(searchTerm);
  return res.json(models);
}

const catalogController = {
  getAll,
  getFeaturedModels,
  getModel,
  addCommentToModel,
  getModelComments,
  postLikeModel,
  deleteModel,
  postFeatureModel,
  postRemoveFeatureModel,
  postDislikeModel,
  postDownloadModel,
  postEditModel,
  deleteComment,
  postSearchModel,
};

module.exports = catalogController;
