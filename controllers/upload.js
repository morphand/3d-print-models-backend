const fs = require("fs/promises");
const Model = require("../models/Model");

async function upload(req, res) {
  const { creatorId, modelName, modelDescription } = JSON.parse(
    req.body.modelInfo
  );
  const files = Object.values(req.files);
  const uploadDir = `./uploads/${creatorId}/${modelName}`;

  if (!creatorId || !modelName) {
    return res.json(false);
  }

  // Check if there is an uploadDir available.
  try {
    await fs.access(uploadDir, fs.constants.W_OK);
  } catch (e) {
    // Create the directories recursively if the uploadDir does not exist.
    if (e.code === "ENOENT") {
      await fs.mkdir(uploadDir, { recursive: true });
    }
  }

  // Loop over uploaded files.
  files.forEach((file) => {
    const fileName = file.name;
    const filePath = `${uploadDir}/${fileName}`;
    // Move each file.
    file.mv(filePath);
  });

  // Save to database.
  const model = new Model({
    name: modelName,
    description: modelDescription,
    path: uploadDir,
    creator: creatorId,
  });
  await model.save();

  return res.json(true);
}

module.exports = upload;
