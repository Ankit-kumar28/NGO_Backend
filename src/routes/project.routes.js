import express from "express";
import {
  createProject,
  getProjects,
  getMyProjects,
  deleteProject,
  getSingleProject  ,
  updateProject    
} from "../controllers/project.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/project", ngoMiddleware, getProjects);
router.get("/project/:id", ngoMiddleware, getSingleProject);    

router.post(
  "/project",
  authMiddleware,
  ngoMiddleware,
 upload.fields([
  {name: "images",maxCount: 10},
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  createProject
);
router.patch(
  "/project/:id",
  authMiddleware, 
  ngoMiddleware,
  upload.fields([
  {name: "images",maxCount: 10},
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  updateProject
);


router.get("/admin/projects", authMiddleware,ngoMiddleware, getMyProjects);

router.delete("/project/:id", authMiddleware, deleteProject);

export default router;