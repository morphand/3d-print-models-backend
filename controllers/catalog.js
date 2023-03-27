// Services
const modelService = require("../services/model");

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
  const model = await modelService.addCommentToModel(modelId, comment);
  return res.json(req.body);
}

const catalogController = {
  getAll,
  getFeaturedModels,
  getModel,
  addCommentToModel,
};

module.exports = catalogController;
