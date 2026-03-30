import express from "express";
import { 
  getHomeContent, 
  getLatestOnly 
} from "../controllers/unifiedContent.controller.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();

router.get("/latest", ngoMiddleware, getLatestOnly);

router.get("/latest/home", ngoMiddleware, getHomeContent);






export default router;