import express from "express";

import authRoutes from "../routes/auth-routes.js";
import userRoutes from "../routes/user-routes.js";
import contactRoutes from "../routes/contact-routes.js";
import addressRoutes from "../routes/address-routes.js";

import { errorMiddleware } from "../middleware/error-middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../../swagger/swagger.js";

export const web = express();
web.use(express.json());

// Swagger harus di atas
web.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public routes
web.use("/api", authRoutes);

// Private routes
web.use("/api", userRoutes);
web.use("/api", contactRoutes);
web.use("/api", addressRoutes);

// Error handler paling bawah
web.use(errorMiddleware);