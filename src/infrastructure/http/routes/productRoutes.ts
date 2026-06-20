import { Router } from "express";
import { container } from "../../../infrastructure/shared/container";
import { validateRequest } from "../middlewares/validateMiddlewares";
import { createProductSchema } from "../../http/schemas/productSchema";
import { requireAuth } from "../middlewares/authMiddlewares";
import { requireRole } from "../middlewares/roleMiddlewares";

const router = Router();
const productController = container.productController;

// Rutas publicas
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Rutas protegidas
router.post(
  "/",
  requireAuth,
  validateRequest(createProductSchema),
  requireRole(["ADMIN"]),
  productController.createProduct,
);
router.patch(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  productController.updateProduct,
);
router.delete(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  productController.deactivateProduct,
);

export { router as productRouter };
