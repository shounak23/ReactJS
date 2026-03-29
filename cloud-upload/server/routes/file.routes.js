import { Router } from "express";
import { getFiles, uploadFile, deleteFile } from "../controllers/fileController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getFiles);
router.post("/", upload.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;