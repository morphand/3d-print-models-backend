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

const constants = require("./constants");

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

mongoose.connect(`mongodb://127.0.0.1/${constants.DB_NAME}`).then(() => {
  console.log(`Connected to database ${constants.DB_NAME}.`);
  app.listen(constants.PORT, () => {
    console.log(`Server listening on port ${constants.PORT}.`);
  });
});

// Login
app.post("/login", loginController);

// Register
app.post("/register", registerController);

// User API endpoint
app.get("/api/user/:id", userController);

// Edit user GET API endpoint
app.get("/api/user/:id/edit", userController);

// Upload endpoint
app.post("/api/user/:id/upload", uploadController);

// Catalog endpoint
app.get("/api/catalog", catalogController.getAll);

// Featured models endpoint
app.get("/api/featuredModels", catalogController.getFeaturedModels);

// Single model endpoint
app.get("/api/models/:id", catalogController.getModel);

// Get model comments endpoint
app.get("/api/models/:id/comments", catalogController.getModelComments);

// Post comments endpoint
app.post("/api/models/:id/comments", catalogController.addCommentToModel);

// Like comments endpoint
app.post("/api/models/:id/like", catalogController.postLikeModel);
