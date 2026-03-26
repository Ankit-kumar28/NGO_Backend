import express from "express";
import { getKnowledgeBase,createKnowledgeBase,deleteKnowledgeBase,getMyKnowledgeBase } from "../controllers/knowledgeBase.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload }from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get("/knowledgeBase", ngoMiddleware, getKnowledgeBase);


router.post(
  "/knowledgeBase",
  authMiddleware,        
  upload.single("file"),
  createKnowledgeBase
);

router.get(
  "/admin/knowledgeBase",
  authMiddleware,
  getMyKnowledgeBase
);

router.delete(
  "/:id",
  authMiddleware,
  deleteKnowledgeBase
);

export default router;