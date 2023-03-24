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

// Upload endpoint
app.post("/api/user/:id/upload", uploadController);
