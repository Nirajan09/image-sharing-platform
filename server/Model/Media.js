const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", MediaSchema);

module.exports = Media;
