import express from "express";
import {
  createQuestionSeries,
  getQuestionSeries,
  getMyQuestionSeries,
  deleteQuestionSeries
} from "../controllers/questionSeries.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {upload }from "../middlewares/upload.middleware.js";

const router = express.Router();


router.get("/question", ngoMiddleware, getQuestionSeries);


router.post(
  "/question",
  authMiddleware,        
  upload.single("file"),
  createQuestionSeries
);

router.get(
  "/admin/question",
  authMiddleware,
  getMyQuestionSeries
);

router.delete(
  "/:id",
  authMiddleware,
  deleteQuestionSeries
);

export default router;