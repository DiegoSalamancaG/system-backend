import { Router } from "express";

// Rutas
import { productRouter } from "./productRoutes";
import { userRouter } from "./userRoutes";
import { authRouter } from "./authRoutes";

// Middlewares
import { requireAuth } from "../../http/middlewares/authMiddlewares";
import { requireRole } from "../../http/middlewares/roleMiddlewares";

const rootRouter = Router();

rootRouter.use("/products", productRouter);
rootRouter.use("/users", requireAuth, requireRole(["ADMIN"]), userRouter);
rootRouter.use("/auth", authRouter);

export { rootRouter };
