import express from "express";
import { createFAQ ,getFAQs,deleteFAQ ,updateFAQ} from "../controllers/faq.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/faqs", ngoMiddleware, getFAQs);
router.post("/faqs", authMiddleware,ngoMiddleware, createFAQ );

router.delete("/faqs/:id", authMiddleware,ngoMiddleware, deleteFAQ);
router.put("/faqs/:id", authMiddleware,ngoMiddleware, updateFAQ);

export default router;