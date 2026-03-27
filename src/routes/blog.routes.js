import express from "express";
import { createBlog ,getBlogs,getSingleBlog,getMyBlogs,deleteBlog} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();
router.get("/blog", ngoMiddleware, getBlogs);           
router.get("/blog/:id", ngoMiddleware, getSingleBlog); 
router.post("/blog", authMiddleware, upload.single("coverImage"), createBlog);
router.get("/admin/blog", authMiddleware, getMyBlogs);
router.delete("/blog/:id", authMiddleware, deleteBlog);
export default router;