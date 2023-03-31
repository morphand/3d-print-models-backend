// Services
const modelService = require("../services/model");

const Result = require("../utils/Result");

async function getAll(req, res) {
  const models = await modelService.getAllModels();
  models.map((model) => {
    const creatorId = model.creator._id.toString();
    const modelFiles = modelService.getModelFiles(creatorId, model.name);
    const modelImages = modelService.getModelImages(creatorId, model.name);
    model.files = modelFiles;
    model.images = modelImages;
  });
  return res.json(models);
}

async function getFeaturedModels(req, res) {
  const featuredModels = await modelService.getFeaturedModels();
  featuredModels.map((model) => {
    const creatorId = model.creator._id.toString();
    const modelFiles = modelService.getModelFiles(creatorId, model.name);
    const modelImages = modelService.getModelImages(creatorId, model.name);
    model.files = modelFiles;
    model.images = modelImages;
  });
  return res.json(featuredModels);
}

async function getModel(req, res) {
  const modelId = req.params.id;
  const model = await modelService.getModelById(modelId);
  const creatorId = model.creator._id.toString();
  const modelFiles = modelService.getModelFiles(creatorId, model.name);
  const modelImages = modelService.getModelImages(creatorId, model.name);
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
  const userId = req.body.userId;
  const model = await modelService.likeModel(modelId, userId);
  return res.json(model);
}

async function deleteModel(req, res) {
  const modelId = req.params.id;
  const userId = req.body.userId;
  const result = new Result();
  const isUserModelCreator = await modelService.isUserModelCreator(
    modelId,
    userId
  );
  if (!isUserModelCreator) {
    result.errors.push("You are not the model creator.");
    return result;
  }
  const deletedModel = await modelService.deleteModel(modelId);
  result.status = true;
  result.value = deletedModel;
  return res.json(result);
}

const catalogController = {
  getAll,
  getFeaturedModels,
  getModel,
  addCommentToModel,
  getModelComments,
  postLikeModel,
  deleteModel,
};

module.exports = catalogController;
