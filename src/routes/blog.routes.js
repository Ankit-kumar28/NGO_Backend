import express from "express";
import { createBlog ,getBlogs,deleteBlog,updateBlog,getSingleBlog} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();
router.get("/blog", ngoMiddleware, getBlogs);           

router.post("/blog", authMiddleware,ngoMiddleware,  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdfUrl", maxCount: 1 }
  ]), createBlog);
  
router.get("/blog/:id", ngoMiddleware, getSingleBlog);

router.patch("/blog/:id", authMiddleware, ngoMiddleware, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "pdfUrl", maxCount: 1 }
  ]), updateBlog);
router.delete("/blog/:id", authMiddleware, ngoMiddleware,deleteBlog);
export default router;