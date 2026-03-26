import express from "express";
import { getKnowledgeBase,createKnowledgeBase,deleteKnowledgeBase,getMyKnowledgeBase,getSingleKnowledgeBase } from "../controllers/knowledgeBase.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload }from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get("/knowledgebase", ngoMiddleware, getKnowledgeBase);
router.get("/knowledgebase/:id", ngoMiddleware, getSingleKnowledgeBase);

router.post(
  "/knowledgebase",
  authMiddleware,        
  upload.single("file"),
  createKnowledgeBase
);

router.get(
  "/admin/knowledgebase",
  authMiddleware,
  getMyKnowledgeBase
);

router.delete(
  "/knowledgebase/:id",
  authMiddleware,
  deleteKnowledgeBase
);

export default router;