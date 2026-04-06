import express from "express";
import { createContact, getContacts,updateContact,
  deleteContact } from "../controllers/contact.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/contact", ngoMiddleware, createContact);


router.get("/contact", authMiddleware,ngoMiddleware, getContacts);
router.patch("/contact/:id", authMiddleware, ngoMiddleware, updateContact);
router.delete("/contact/:id", authMiddleware, ngoMiddleware, deleteContact);

export default router;