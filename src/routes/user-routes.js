// user-routes.js

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile operations
 */

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Get current logged-in user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User data
 */

/**
 * @swagger
 * /users/current:
 *   patch:
 *     summary: Update current user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 */

/**
 * @swagger
 * /users/logout:
 *   delete:
 *     summary: Logout current user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 */

import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/users/current", userController.get);
router.patch("/users/current", userController.update);
router.delete("/users/logout", userController.logout);

export default router;

