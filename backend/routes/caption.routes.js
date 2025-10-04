import express from "express";
import { upload } from "../middlewares/multer.js"; // your existing multer middleware
import generateCaption from "../controllers/caption.controllers.js";

const captionRouter = express.Router();

// POST /api/caption/generate
captionRouter.post("/generate", upload.single("media"), generateCaption);

export default captionRouter;
