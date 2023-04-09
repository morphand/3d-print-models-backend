// Core modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

// Controllers
const loginController = require("./controllers/login");
const registerController = require("./controllers/register");
const userController = require("./controllers/user");
const uploadController = require("./controllers/upload");
const catalogController = require("./controllers/catalog");

const { PORT, DB_NAME } = require("./constants");

const authToken = require("./middlewares/authToken");

// Init
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  // Set max file size to upload to ~50MB.
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(/uploads\/.+\/.+\/images/, express.static("uploads"));
app.use(authToken);

mongoose.connect(`mongodb://127.0.0.1/${DB_NAME}`).then(() => {
  console.log(`Connected to database ${DB_NAME}.`);
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });
});

// Login
app.post("/api/login", loginController);

// Register
app.post("/api/register", registerController);

// User API endpoint
app.get("/api/user/:id", userController.getUser);

// Edit user GET API endpoint
app.get("/api/user/:id/edit", userController.getEditUser);

// Edit user API endpoint
app.post("/api/user/:id/edit", userController.postEditUser);

// Get user models endpoint
app.get("/api/user/:id/models", userController.getUserModels);

// Upload endpoint
app.post("/api/user/:id/upload", uploadController);

// Catalog endpoint
app.get("/api/catalog", catalogController.getAll);

// Featured models endpoint
app.get("/api/featuredModels", catalogController.getFeaturedModels);

// Single model endpoint
app.get("/api/models/:id", catalogController.getModel);

// Delete model endpoint
app.delete("/api/models/:id", catalogController.deleteModel);

// Edit model endpoint
app.post("/api/models/:id/edit", catalogController.postEditModel);

// Get model comments endpoint
app.get("/api/models/:id/comments", catalogController.getModelComments);

// Post comments endpoint
app.post("/api/models/:id/comments", catalogController.addCommentToModel);

// Delete comments endpoint
app.delete("/api/models/:id/comments", catalogController.deleteComment);

// Add like model endpoint
app.post("/api/models/:id/like/add", catalogController.postLikeModel);

// Remove like model endpoint
app.post("/api/models/:id/like/remove", catalogController.postDislikeModel);

// Feature model endpoint
app.post("/api/models/:id/feature/add", catalogController.postFeatureModel);

// Remove feature model endpoint
app.post(
  "/api/models/:id/feature/remove",
  catalogController.postRemoveFeatureModel
);

// Download model endpoint
app.put("/api/models/:id/download", catalogController.postDownloadModel);

// Search model endpoint
app.post("/api/models/search/", catalogController.postSearchModel);
