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
  ngoMiddleware,
 upload.fields([
  {name: "images",maxCount: 10},
    { name: "coverImage", maxCount: 1 },
    { name: "pdfUrl", maxCount: 1 }
  ]),
  createProject
);

router.get("/admin/projects", authMiddleware,ngoMiddleware, getMyProjects);

router.delete("/project/:id", authMiddleware, deleteProject);

export default router;