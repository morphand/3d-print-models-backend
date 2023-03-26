// Models
const Model = require("../models/Model");

async function getModelById(modelId) {
  const result = await Model.findById({ modelId }).populate("creator").lean();
  return result;
}

async function getNModels(numberOfModels) {
  const result = await Model.find({})
    .limit(numberOfModels)
    .populate("creator")
    .lean();
  return result;
}

async function getAllModels() {
  const result = await Model.find({}).populate("creator").lean();
  return result;
}

async function getFeaturedModels() {
  const result = await Model.find({ isFeatured: true })
    .limit(4)
    .populate("creator")
    .lean();
  return result;
}

const modelService = {
  getModelById,
  getNModels,
  getAllModels,
  getFeaturedModels,
};

module.exports = modelService;
