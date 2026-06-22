import { Router, Request, Response, NextFunction } from "express";
import { container } from "../../../infrastructure/shared/container";
import { validateRequest } from "../middlewares/validateMiddlewares";
import { createProductSchema } from "../../http/schemas/productSchema";
import { requireAuth } from "../middlewares/authMiddlewares";
import { requireRole } from "../middlewares/roleMiddlewares";
import { upload } from "../middlewares/uploadMiddleware";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface"; // Asegúrate de importar tu interfaz

const router = Router();
const productController = container.productController;

// Rutas públicas (Usan Request estándar de Express, no necesitan casteo)
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  productController.getAllProducts(req, res, next),
);
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  productController.getProductById(req, res, next),
);

// Rutas protegidas (Forzamos a que el callback final maneje AuthenticatedRequest)
router.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  upload.array("images", 4), // 1º Multer procesa imágenes y llena el body
  validateRequest(createProductSchema), // 2º Zod valida el body ya procesado
  (req: Request, res: Response, next: NextFunction) =>
    productController.createProduct(req as AuthenticatedRequest, res, next), // 🚀 El casteo mágico
);

router.patch(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  (req: Request, res: Response, next: NextFunction) =>
    productController.updateProduct(req as AuthenticatedRequest, res, next), // 🚀 El casteo mágico
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  (req: Request, res: Response, next: NextFunction) =>
    productController.deactivateProduct(req as AuthenticatedRequest, res, next), // 🚀 El casteo mágico
);

export { router as productRouter };
