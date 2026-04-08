import express from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  deleteEvent,
  getSingleEvent,
  updateEvent
} from "../controllers/event.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/event", ngoMiddleware, getEvents);
router.get("/event/:id", ngoMiddleware, getSingleEvent);

router.post(
  "/event",
  authMiddleware,
  ngoMiddleware,
 upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ])  ,
  createEvent
);
router.patch(
  "/event/:id",
  authMiddleware,
  ngoMiddleware,
 upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ])  ,
  updateEvent
);
router.get("/admin/events", authMiddleware, ngoMiddleware,getMyEvents);
router.delete("/event/:id", authMiddleware, ngoMiddleware, deleteEvent);

export default router;