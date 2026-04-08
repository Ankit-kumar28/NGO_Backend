// routes/getInvolved.routes.js
import express from "express";
import {
  createGetInvolved,
  getGetInvolved,
  updateStatus,
  deleteGetInvolved
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

router.get("/get-involved", authMiddleware,ngoMiddleware, getGetInvolved);
router.patch("/get-involved/:id/status", authMiddleware, ngoMiddleware, updateStatus);
router.delete("/get-involved/:id", authMiddleware, ngoMiddleware, deleteGetInvolved);

export default router;