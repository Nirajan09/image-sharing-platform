const upload = require("../cloudinaryHelpers/index");
const Media = require("../Model/Media");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
// Upload Image
const UploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "Please Add Image to Continue",
      });
    }
    const imageRes = await upload(req.file.path, "image");
    const { url, publicId } = imageRes;
    const createdImage = await Media.create({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
      type: "image",
    });

    //delete the file from local system
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Image uploaded Successfully",
      image: createdImage,
    });
  } catch (error) {
    console.log("Error uploading the image", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Fetch Media
const fetchController = async (req, res) => {
  try {
    //pagination
    const currentPage = Math.max(req.query.page || 1, 1);
    const pageLimit = Math.max(req.query.limit || 8, 1);
    const skip = (currentPage - 1) * pageLimit;
    const totalMedia = await Media.countDocuments();
    const totalPages = Math.ceil(totalMedia / pageLimit);

    //sorting Media
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;

    const sortMedia = {};
    sortMedia[sortBy] = sortOrder;

    const images = await Media.find()
      .sort(sortMedia)
      .limit(pageLimit)
      .skip(skip)
      .populate("uploadedBy", "username email")
      .exec();
    if (images) {
      return res.status(200).json({
        success: true,
        message: "Image Fetched Successfully",
        data: images,
        currentPage: currentPage,
        TotalMedia: totalMedia,
        TotalPage: totalPages,
        pageLimit: pageLimit,
      });
    }
  } catch (error) {
    console.log("Error fetching the image", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//fetch the media that the user has only uploaded
const fetchUserMediaController = async (req, res) => {
  try {
    //pagination
    const currentPage = Math.max(req.query.page || 1, 1);
    const pageLimit = Math.max(req.query.limit || 8, 1);
    const skip = (currentPage - 1) * pageLimit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sortMedia = {};
    sortMedia[sortBy] = sortOrder;

    const userId = req.params.id;

    const images = await Media.find({ uploadedBy: userId })
      .sort(sortMedia)
      .limit(pageLimit)
      .skip(skip)
      .populate("uploadedBy", "username email")
      .exec();
    const totalMedia = images.length;
    const totalPages = Math.ceil(totalMedia / pageLimit);
    if (images) {
      res.status(200).json({
        success: true,
        message: "Fetching the data is successful",
        data: images,
        currentPage: currentPage,
        TotalMedia: totalMedia,
        TotalPage: totalPages,
        pageLimit: pageLimit,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Error Fetching images",
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Update Image
const UpdateImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image to update",
      });
    }

    //get the user Info
    const userId = req.userInfo.userId;
    //get the image ID
    const getmediaID = req.params.id;

    const media = await Media.findById(getmediaID);

    if (!media) {
      res.status(404).json({
        success: false,
        message: "The Image is not found",
      });
    }
    if (media.type != "image") {
      res.status(401).json({
        success: false,
        message: "The Media format must be Image",
      });
    }
    //check if the user has uploaded that image or not
    if (userId !== media.uploadedBy.toString()) {
      return res.status(401).json({
        success: false,
        message: "Only the authorized user can update the Image",
      });
    }

    //delete the old image from cloudinary
    await cloudinary.uploader.destroy(media.publicId);

    //upload the updated Image into cloudinary
    const uploadImage = await upload(req.file.path, "image");
    const { url, publicId } = uploadImage;

    //upload the updated Image into database
    media.url = url;
    media.publicId = publicId;
    await media.save();

    //delete the file from local system
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "The image updated Successfully",
      data: media,
    });
  } catch (error) {
    console.log("Error updating the image", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteMediaController = async (req, res) => {
  try {
    //get the user ID
    const userId = req.userInfo.userId;
    //get the media Id
    const getMediaID = req.params.id;
    const media = await Media.findById(getMediaID);

    if (!media) {
      res.status(404).json({
        success: false,
        message: "The Media cannot be found",
      });
    }

    if (userId != media.uploadedBy.toString()) {
      res.status(401).json({
        success: false,
        message: "Only the authorized person can delete the media.",
      });
    }

    await cloudinary.uploader.destroy(media.publicId, media.type);

    await Media.findByIdAndDelete(getMediaID);

    res.status(200).json({
      success: true,
      message: "The Media has been deleted Successfully.",
    });
  } catch (error) {
    console.log("Error deleting the media", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
module.exports = {
  UploadImageController,
  fetchController,
  UpdateImageController,
  deleteMediaController,
  fetchUserMediaController,
};
