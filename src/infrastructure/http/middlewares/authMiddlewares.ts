import { Response, NextFunction } from "express";
import { container } from "../../shared/container";
import { UnauthorizedError } from "../../../core/shared/Errors/typeErrors";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Acceso denegado: Token inválido");
    }

    const token = authHeader.split(" ")[1];

    const decoded = container.jwtTokenService.verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Acceso denegado: Token inválido");
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
