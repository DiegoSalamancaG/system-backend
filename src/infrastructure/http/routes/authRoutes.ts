import { Router } from "express";
import { container } from "../../shared/container";
import { validateRequest } from "../middlewares/validateMiddlewares";
import { registerSchema, loginSchema } from "../schemas/authSchemas";

const router = Router();
const authController = container.authController;

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);

export { router as authRouter };
