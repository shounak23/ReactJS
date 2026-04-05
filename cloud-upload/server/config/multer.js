import multer from "multer";

const storage = multer.memoryStorage(); // ← no local disk

export const uploadMulter = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});