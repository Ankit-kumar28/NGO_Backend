import express from "express";
import { createBlog ,getBlogs,getMyBlogs,deleteBlog} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();

router.post(
  "/blog",
  authMiddleware,        
  upload.single("file"), 
  createBlog
);


router.get(
  "/blogs",
  ngoMiddleware,     
  getBlogs
);

router.get(
  "/MyBlogs",
  authMiddleware,     
  getMyBlogs
);


router.delete(
  "/blog/:id",
  authMiddleware,  
  deleteBlog
);
export default router;