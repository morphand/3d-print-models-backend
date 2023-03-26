const modelService = require("../services/model");

async function getAll(req, res) {
  const models = await modelService.getAllModels();
  return res.json(models);
}

async function getFeaturedModels(req, res) {
  const featuredModels = await modelService.getFeaturedModels();
  return res.json(featuredModels);
}

const catalogController = { getAll, getFeaturedModels };

module.exports = catalogController;
