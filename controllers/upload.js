const fs = require("fs/promises");
const User = require("../models/User");
const Model = require("../models/Model");
const Result = require("../utils/Result");

async function upload(req, res) {
  const { creatorId, modelName, modelDescription } = JSON.parse(
    req.body.modelInfo
  );

  // Create the model.
  const model = new Model({
    name: modelName,
    description: modelDescription,
    creator: creatorId,
  });

  const uploadDir = `./uploads/${creatorId}/${model._id.toString()}`;
  const imagesDir = `${uploadDir}/images`;

  // Add path to model.
  model.path = uploadDir;

  const result = new Result();

  if (!creatorId || !modelName || !req.files) {
    result.errors.push("Creator ID, model name and files are required.");
    return res.json(result);
  }

  // Check if there is an uploadDir available.
  try {
    await fs.access(uploadDir, fs.constants.W_OK);
  } catch (e) {
    // Create the directories recursively if the uploadDir does not exist.
    if (e.code === "ENOENT") {
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.mkdir(imagesDir, { recursive: true });
    }
  }

  // Loop over uploaded files.
  for (const [key, value] of Object.entries(req.files)) {
    const fileName = value.name;
    let filePath = `${uploadDir}/${fileName}`;

    // Upload images to the images folder.
    if (key.includes("image")) {
      filePath = `${uploadDir}/images/${fileName}`;
    }

    // Move each file.
    value.mv(filePath);
  }

  // Save to database.
  const savedModel = await model.save();

  // Update user model.
  const user = await User.findById(creatorId).populate("uploadedModels").lean();
  user.uploadedModels.push(model._id);
  await User.findByIdAndUpdate(creatorId, {
    uploadedModels: user.uploadedModels,
  });

  result.status = true;
  result.value = savedModel;
  return res.json(result);
}

module.exports = upload;
