const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const streamUpload = (buffer, type = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: type },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(stream);
  });
};

module.exports = streamUpload;
