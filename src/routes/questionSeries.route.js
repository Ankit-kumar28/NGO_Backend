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
  ngoMiddleware,
  upload.single("file"),       
  createQuestionSeries
);

router.patch(
  "/question/:id",            
  authMiddleware,
  ngoMiddleware,
  upload.single("file"),
  updateQuestionSeries
);

router.get(
  "/question",

  authMiddleware,
  ngoMiddleware,
  getMyQuestionSeries          
);

router.delete(
  "/question/:id",            
  authMiddleware,
  ngoMiddleware,
  deleteQuestionSeries
);

export default router;