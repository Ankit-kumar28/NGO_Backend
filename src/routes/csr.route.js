// routes/csr.routes.js
import express from "express";
import {
  createCSRForm,
  getCSRForms,
  updateCSRStatus,
  deleteCSRForm
} from "../controllers/csr.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/csr", ngoMiddleware, createCSRForm);


router.get("/csr", authMiddleware, getCSRForms);                        
router.patch("/csr/:id/status", authMiddleware, updateCSRStatus);
router.delete("/csr/:id", authMiddleware, deleteCSRForm);

export default router;