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
  "/donate",
  ngoMiddleware,   
  createDonation
);
router.get("/donation/status", ngoMiddleware, checkDonationStatus);



router.get(
  "/donations",
  authMiddleware, 
  getDonations
);

router.put("/donation/:id", authMiddleware, verifyDonation);
export default router;