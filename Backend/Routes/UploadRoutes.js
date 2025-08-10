import express from "express";
import { upload } from "../Config/cloudinaryConfig.js";
import { UploadImage } from "../Controllers/UploadController.js";
const router = express.Router();

router.post("/", upload.single("image"), UploadImage);

export default router;
