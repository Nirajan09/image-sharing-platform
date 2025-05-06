const multer = require("multer");
const path = require("path");

//multer Storage
const storage = multer.memoryStorage();

//file image filter function
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Please Upload only Image"));
  }
};

const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

module.exports = { uploadImage };
