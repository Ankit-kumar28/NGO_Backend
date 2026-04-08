import express from "express";
import {
  createDonation,
  getDonations,
  checkDonationStatus,
  verifyDonation
} from "../controllers/donation.controller.js";

import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post(
  "/donation",
  ngoMiddleware,   
  createDonation
);
router.get("/donation/status", ngoMiddleware, checkDonationStatus);



router.get(
  "/donation",
  authMiddleware, 
  ngoMiddleware,
  getDonations
);

router.patch("/donation/:id", authMiddleware, ngoMiddleware, verifyDonation);
export default router;