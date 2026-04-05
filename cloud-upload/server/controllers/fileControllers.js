import { Files } from "../models/file.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import cloudinary from "../config/cloudinary.js";

// GET all files for logged in user
export const getFiles = async (req, res, next) => {
  try {
    const files = await Files.find({ owner: req.session.user.id });

    return res
      .status(200)
      .json(new ApiResponse(200, "Files fetched successfully", files));
  } catch (error) {
    next(error);
  }
};

// POST upload a file
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, "No file uploaded");

    // upload buffer to cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "cloud-upload" },
        (error, result) => {
          if (error) reject(new ApiError(500, "Cloudinary upload failed"));
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // ← memory buffer goes to cloudinary
      //const result = await cloudinary.uploader.upload(req.file.path);

    });

    const file = await Files.create({
      originalName: req.file.originalname,
      storedName: cloudinaryResult.filename,
      fileUrl: cloudinaryResult.path, // cloudinary gives URL in req.file.path
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      cloudPublicId: req.file.filename, // cloudinary public id
      owner: req.session.user.id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "File uploaded successfully", file));
  } catch (error) {
    next(error);
  }
};

// DELETE a file
export const deleteFile = async (req, res, next) => {
  try {
    const file = await Files.findById(req.params.id);

    if (!file) throw new ApiError(404, "File not found");

    // make sure the file belongs to the logged in user
    if (file.owner.toString() !== req.session.user.id.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(file.cloudPublicId);

    // delete from DB
    await file.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, "File deleted successfully"));
  } catch (error) {
    next(error);
  }
};
