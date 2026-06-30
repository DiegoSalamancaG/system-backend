import { Router, Request, Response, NextFunction } from "express";
import { container } from "../../shared/container";
import { upload } from "../middlewares/uploadMiddleware";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";

const router = Router();
const landingController = container.landingSectionController;

router.post(
  "/",
  upload.array("images", 10),
  (req: Request, res: Response, next: NextFunction) =>
    landingController.createSection(
      req as AuthenticatedRequest & { files: any },
      res,
      next,
    ),
);
router.get("/", landingController.getAllSections);
router.patch(
  "/:id",
  upload.array("images", 10),
  (req: Request, res: Response, next: NextFunction) =>
    landingController.updateSection(
      req as AuthenticatedRequest & { files: any },
      res,
      next,
    ),
);

export { router as landingRouter };
