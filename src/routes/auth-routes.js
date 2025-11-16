// auth-routes.js

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration & login
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success & returns token
 *       401:
 *         description: Invalid credentials
 */

import express from "express";
import userController from "../controllers/user-controller.js";

const router = express.Router();

router.post("/users", userController.register);
router.post("/users/login", userController.login);

export default router;
