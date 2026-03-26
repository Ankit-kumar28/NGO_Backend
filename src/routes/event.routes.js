import express from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  deleteEvent
} from "../controllers/event.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get(
  "/events",
  ngoMiddleware,
  getEvents
);


router.post(
  "/event",
  authMiddleware,
  upload.single("file"),  
  createEvent
);

router.get(
  "/admin/events",
  authMiddleware,
  getMyEvents
);

router.delete(
  "/event/:id",
  authMiddleware,
  deleteEvent
);

export default router;