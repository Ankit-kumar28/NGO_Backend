import express from "express";
import {
  createProject,
  getProjects,
  getMyProjects,
  deleteProject,
  getSingleProject      
} from "../controllers/project.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/projects", ngoMiddleware, getProjects);
router.get("/project/:id", ngoMiddleware, getSingleProject);    

router.post(
  "/project",
  authMiddleware,
  upload.single("file"),
  createProject
);

router.get("/admin/projects", authMiddleware, getMyProjects);

router.delete("/project/:id", authMiddleware, deleteProject);

export default router;