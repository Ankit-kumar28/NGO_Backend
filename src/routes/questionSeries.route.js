// routes/questionSeries.route.js

import express from "express";
import {
  createQuestionSeries,
  updateQuestionSeries,
  getQuestionSeries,
  getSingleQuestionSeries,
  getMyQuestionSeries,
  deleteQuestionSeries,
} from "../controllers/questionSeries.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get(
  "/question",
  ngoMiddleware,
  getQuestionSeries          
);

router.get(
  "/question/:id",
  ngoMiddleware,
  getSingleQuestionSeries
);

router.post(
  "/question",
  authMiddleware,
  upload.single("file"),       
  createQuestionSeries
);

router.put(
  "/question/:id",            
  authMiddleware,
  upload.single("file"),
  updateQuestionSeries
);

router.get(
  "/admin/question",
  authMiddleware,
  getMyQuestionSeries          
);

router.delete(
  "/question/:id",            
  authMiddleware,
  deleteQuestionSeries
);

export default router;