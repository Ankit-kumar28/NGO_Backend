import express from "express";
import {
  applyApplication,
  getApplications,
  updateApplicationStatus
} from "../controllers/application.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/apply", ngoMiddleware, applyApplication);


router.get("/apply", authMiddleware, getApplications);
router.patch("/:id/status", authMiddleware, updateApplicationStatus);

export default router;