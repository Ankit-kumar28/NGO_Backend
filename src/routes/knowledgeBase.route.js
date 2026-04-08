// routes/knowledgeBase.route.js
import express from "express";
import {
  createKnowledgeBase,
  updateKnowledgeBase,
  getKnowledgeBase,
  getSingleKnowledgeBase,
  getMyKnowledgeBase,
  deleteKnowledgeBase,
} from "../controllers/knowledgeBase.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get(
  "/knowledgebase",
  ngoMiddleware,
  getKnowledgeBase            
);

router.get(
  "/knowledgebase/:id",
  ngoMiddleware,
  getSingleKnowledgeBase
);

router.post(
  "/knowledgebase",
  authMiddleware,
  ngoMiddleware,
  upload.single("file"),
  createKnowledgeBase
);

router.patch(
  "/knowledgebase/:id",        
  authMiddleware,
  ngoMiddleware,
  upload.single("file"),
  updateKnowledgeBase
);

router.get(
  "/knowledgebase",
  authMiddleware,
  ngoMiddleware,
  getMyKnowledgeBase            
);

router.delete(
  "/knowledgebase/:id",
  authMiddleware,
  ngoMiddleware,
  deleteKnowledgeBase
);

export default router;