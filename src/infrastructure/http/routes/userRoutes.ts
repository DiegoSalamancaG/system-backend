import { Router } from "express";
import { container } from "../../../infrastructure/shared/container";
import { validateRequest } from "../middlewares/validateMiddlewares";
import { registerUserSchema } from "../../http/schemas/userSchema";

const router = Router();
const userController = container.userController;

router.post(
  "/",
  validateRequest(registerUserSchema),
  userController.createUser,
);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deactivateUser);

export { router as userRouter };
