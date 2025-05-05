const express = require("express");
const {
  UploadImageController,
  fetchController,
  UpdateImageController,
  deleteMediaController,
  fetchUserMediaController,
} = require("../Controller/MediaController");
const authMiddleware = require("../MiddleWare/authMiddleware");
const { uploadImage } = require("../MiddleWare/uploadMiddleware");
const router = express.Router();

// Create Route
router.post(
  "/upload-image",
  authMiddleware,
  uploadImage.single("image"),
  UploadImageController
);

//View Route
router.get("/get-media", authMiddleware, fetchController);
router.get("/get-media/:id", authMiddleware, fetchUserMediaController);

//Update Image Route
router.put(
  "/update-image/:id",
  authMiddleware,
  uploadImage.single("image"),
  UpdateImageController
);

//delete the media route
router.delete("/delete-media/:id", authMiddleware, deleteMediaController);
module.exports = router;
