import express from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  deleteEvent,
  getSingleEvent,
} from "../controllers/event.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/events", ngoMiddleware, getEvents);
router.get("/event/:id", ngoMiddleware, getSingleEvent);

router.post(
  "/event",
  authMiddleware,
  ngoMiddleware,
  upload.single("image"),   
  createEvent
);

router.get("/admin/events", authMiddleware, ngoMiddleware,getMyEvents);
router.delete("/event/:id", authMiddleware, ngoMiddleware, deleteEvent);

export default router;