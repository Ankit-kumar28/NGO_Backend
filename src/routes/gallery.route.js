import express from "express";
import { createGallery,getGallery,getMyGallery,deleteMyGallery} from "../controllers/gallery.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
// import { ngoMiddleware } from "../middlewares/ngo.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { ngoMiddleware } from "../middlewares/ngo.middleware.js";

const router = express.Router();

router.post(
  "/gallery",

  authMiddleware,
  upload.single("file"),
  createGallery
);

router.get(
  "/gallery",
  ngoMiddleware,
  getGallery
);
router.get(
  "/admin/gallery",
  authMiddleware,
  getMyGallery
);

router.delete(
  "/admin/gallery/:id",
  authMiddleware,
  deleteMyGallery
);
export default router;

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Gallery management endpoints for NGO media uploads
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     summary: Create a new gallery item (Upload media)
 *     description: Upload image or PDF for the authenticated user's NGO.
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Media file (jpg, jpeg, png, or pdf - max 5MB)
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               mediaType:
 *                 type: string
 *                 enum: [image, video]
 *     responses:
 *       201:
 *         description: Gallery item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Gallery'
 *       400:
 *         description: Bad request - File is required
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get gallery items for a specific NGO
 *     description: Public endpoint. Requires x-ngo-id header with valid NGO code.
 *     tags: [Gallery]
 *     parameters:
 *       - in: header
 *         name: x-ngo-id
 *         required: true
 *         schema:
 *           type: string
 *         description: NGO code (e.g. NGO001)
 *     responses:
 *       200:
 *         description: List of gallery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 ngo:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gallery'
 *       400:
 *         description: x-ngo-id header is required
 *       404:
 *         description: Invalid NGO code
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/gallery:
 *   get:
 *     summary: Get my own uploaded gallery items
 *     description: Returns only gallery items uploaded by the currently logged-in user.
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's gallery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gallery'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/gallery/{id}:
 *   delete:
 *     summary: Delete a gallery item
 *     description: Only the user who uploaded the item can delete it. Also removes the physical file.
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gallery document ID
 *     responses:
 *       200:
 *         description: Gallery deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Gallery not found or not authorized to delete
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gallery:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         mediaUrl:
 *           type: string
 *         mediaType:
 *           type: string
 *           enum: [image, video]
 *         ngo:
 *           type: string
 *         uploadedBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */