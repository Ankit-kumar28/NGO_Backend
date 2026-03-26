import express from "express";
import { createContact, getContacts } from "../controllers/contact.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/contact", ngoMiddleware, createContact);


router.get("/contact", authMiddleware, getContacts);

export default router;