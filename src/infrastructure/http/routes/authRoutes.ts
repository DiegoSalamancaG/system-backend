import { Router } from "express";
import { container } from "../../shared/container";
import { validateRequest } from "../middlewares/validateMiddlewares";
import { registerSchema, loginSchema } from "../schemas/authSchemas";

const router = Router();
const authController = container.authController;

// Login y Register
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);

// Forgot y Reset Password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export { router as authRouter };
