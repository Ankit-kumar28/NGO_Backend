import express from "express";
import { createFAQ ,getFAQs,deleteFAQ } from "../controllers/faq.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/faqs", ngoMiddleware, getFAQs);
router.post("/faqs", authMiddleware, createFAQ);

router.delete("/faqs/:id", authMiddleware, deleteFAQ);


export default router;