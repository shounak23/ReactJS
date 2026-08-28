import { Router } from "express";
import {
  getFiles,
  uploadFile,
  deleteFile,
} from "../controllers/fileControllers.js";
import { uploadMulter } from "../config/multer.js";


const router = Router();

router.get("/", getFiles);
router.post("/upload", uploadMulter.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;
