// address-routes.js

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address operations for a contact
 */

/**
 * @swagger
 * /contacts/{contactId}/addresses:
 *   post:
 *     summary: Create address for a contact
 *     security:
 *       - bearerAuth: []
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               province:
 *                 type: string
 *               country:
 *                 type: string
 *               postal_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address created
 */

/**
 * @swagger
 * /contacts/{contactId}/addresses:
 *   get:
 *     summary: List addresses of a contact
 *     security:
 *       - bearerAuth: []
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of addresses
 */

/**
 * @swagger
 * /contacts/{contactId}/addresses/{addressId}:
 *   get:
 *     summary: Get one address
 *     security:
 *       - bearerAuth: []
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Address detail
 */

/**
 * @swagger
 * /contacts/{contactId}/addresses/{addressId}:
 *   put:
 *     summary: Update an address
 *     security:
 *       - bearerAuth: []
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated address
 */

/**
 * @swagger
 * /contacts/{contactId}/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     security:
 *       - bearerAuth: []
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

import express from "express";
import addressController from "../controllers/address-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/contacts/:contactId/addresses", addressController.create);
router.get("/contacts/:contactId/addresses", addressController.list);
router.get("/contacts/:contactId/addresses/:addressId", addressController.get);
router.put("/contacts/:contactId/addresses/:addressId", addressController.update);
router.delete("/contacts/:contactId/addresses/:addressId", addressController.remove);

export default router;
