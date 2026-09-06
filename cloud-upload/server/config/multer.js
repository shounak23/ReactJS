import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // ✅ allow
  } else {
    cb(new ApiError(400, "File type not allowed"), false); // ❌ reject
  }
};

const fileSizeMB = Number(process.env.FILES_SIZE_CLOUD_MB) || 5;

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: fileSizeMB * 1024 * 1024, // 5MB
  },
});
