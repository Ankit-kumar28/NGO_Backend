import express from "express";
import {
  createProject,
  getProjects,
  getMyProjects,
  deleteProject
} from "../controllers/project.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get("/", ngoMiddleware, getProjects);


router.post(
  "/project",
  authMiddleware,
  upload.single("file"), 
  createProject
);

router.get("/admin/project", authMiddleware, getMyProjects);

router.delete("/:id", authMiddleware, deleteProject);

export default router;