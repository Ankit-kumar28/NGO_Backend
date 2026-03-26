import express from "express";
import {
  getGetInvolved,
  upsertGetInvolved
} from "../controllers/getInvolved.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get("/", ngoMiddleware, getGetInvolved);

router.post(
  "/",  
  authMiddleware,
  upload.single("image"),
  upsertGetInvolved
);

export default router;