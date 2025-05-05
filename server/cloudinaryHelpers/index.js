const cloudinary = require("../config/cloudinary");

const upload = async (filePath, type = "image") => {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: type,
    });
    return {
      url: res.secure_url,
      publicId: res.public_id,
    };
  } catch (error) {
    console.log("Error while connecting to cloudinary Server", error);
  }
};

module.exports = upload;
