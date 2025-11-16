// contact-routes.js

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact operations
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     security:
 *       - bearerAuth: []
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact created
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Search contacts
 *     security:
 *       - bearerAuth: []
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of contacts
 */

/**
 * @swagger
 * /contacts/{contactId}:
 *   get:
 *     summary: Get single contact
 *     security:
 *       - bearerAuth: []
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact detail
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /contacts/{contactId}:
 *   put:
 *     summary: Update contact
 *     security:
 *       - bearerAuth: []
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
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
 *         description: Updated contact
 */

/**
 * @swagger
 * /contacts/{contactId}:
 *   delete:
 *     summary: Delete contact
 *     security:
 *       - bearerAuth: []
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

import express from "express";
import contactController from "../controllers/contact-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/contacts", contactController.create);
router.get("/contacts", contactController.search);
router.get("/contacts/:contactId", contactController.get);
router.put("/contacts/:contactId", contactController.update);
router.delete("/contacts/:contactId", contactController.remove);

export default router;
