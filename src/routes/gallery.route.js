import express from "express";
import { createGallery,getGallery,getMyGallery,deleteMyGallery} from "../controllers/gallery.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();

router.post(
  "/gallery",

  authMiddleware,
  upload.single("file"),
  createGallery
);

router.get(
  "/gallery",
  ngoMiddleware,
  getGallery
);
router.get(
  "/admin/gallery",
  authMiddleware,
  getMyGallery
);

router.delete(
  "/admin/gallery/:id",
  authMiddleware,
  deleteMyGallery
);
export default router;