import express from "express";
import { register ,login} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// register route
router.post("/register", register);
router.post("/login", login);
// GET all users (protected)
// router.get("/users", authMiddleware, getAllUsers);

export default router;