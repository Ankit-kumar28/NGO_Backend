// routes/getInvolved.routes.js
import express from "express";
import {
  createGetInvolved,
  getGetInvolved,
  updateStatus
} from "../controllers/getInvolved.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/get-involved",
  ngoMiddleware,                
  upload.single("resume"),      
  createGetInvolved             
);

router.get("/get-involved", authMiddleware, getGetInvolved);
router.patch("/get-involved/:id/status", authMiddleware, updateStatus);

export default router;