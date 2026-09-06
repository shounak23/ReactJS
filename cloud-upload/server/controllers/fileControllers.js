import { Files } from "../models/file.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import cloudinary from "../config/cloudinary.js";

// GET all files for logged in user
export const getFiles = async (req, res, next) => {
  try {
    const limit = parseInt(process.env.FILES_PER_PAGE) || 10;
    const cursor = req.query.cursor || null;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";
    const type = req.query.type || ""; // filter by file type

    // build filter
    const filter = {
      owner: req.user._id,
    };

    // search by file name
    if (search) {
      filter.originalName = {
        $regex: search,
        $options: "i",
      };
    }

    // filter by file type
    if (type) {
      filter.fileType = {
        $regex: type,
        $options: "i", // "image" matches image/jpeg, image/png etc
      };
    }

    // cursor filter
    if (cursor) {
      filter._id = { $lt: cursor }; // files before this cursor
    }

    // fetch files
    const files = await Files.find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .limit(limit + 1); // fetch one extra to check if more exist

    // check if more files exist
    const hasMore = files.length > limit;

    // remove the extra file
    if (hasMore) files.pop();

    // next cursor = last file's ID
    const nextCursor = hasMore ? files[files.length - 1]._id : null;

    return res.status(200).json(
      new ApiResponse(200, "Files fetched successfully", {
        files,
        nextCursor,
        hasMore,
      }),
    );
  } catch (error) {
    next(error);
  }
};

// POST upload a file
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, "No file uploaded");
    console.log("files", req.file);
    // upload buffer to cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "cloud-upload",
          public_id: `${Date.now()}_${req.file.originalname.split(".")[0]}`,
        },
        (error, result) => {
          if (error) reject(new ApiError(500, "Cloudinary upload failed"));
          else resolve(result);
        },
      );
      stream.end(req.file.buffer); // ← memory buffer goes to cloudinary
      //const result = await cloudinary.uploader.upload(req.file.path);
    });

    console.log("cloudinaryResult", cloudinaryResult);

    const file = await Files.create({
      originalName: req.file.originalname,
      storedName: cloudinaryResult.public_id,
      fileUrl: cloudinaryResult.secure_url, // cloudinary gives URL in req.file.path
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      cloudPublicId: cloudinaryResult.public_id, // cloudinary public id
      owner: req.user._id,
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
