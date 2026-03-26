import express from "express";
import NGO from "../models/ngo.model.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, code, email } = req.body;

    const ngo = await NGO.create({
      name,
      code,
      email
    });

    res.status(201).json({
      success: true,
      data: ngo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;