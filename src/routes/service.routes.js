import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-ngo-id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               visibility:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Service created successfully
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, ngoMiddleware, upload.single("image"), createService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services for an NGO
 *     tags: [Services]
 *     parameters:
 *       - in: header
 *         name: x-ngo-id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of services
 *       500:
 *         description: Server error
 */
router.get("/", ngoMiddleware, getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: header
 *         name: x-ngo-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single service
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get("/:id", ngoMiddleware, getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-ngo-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               visibility:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", authMiddleware, ngoMiddleware, upload.single("image"), updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-ngo-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.delete("/:id",authMiddleware, ngoMiddleware, deleteService);

export default router;

