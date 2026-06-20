import { Response, NextFunction } from "express";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../../core/shared/Errors/typeErrors";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";

export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    try {
      // 1. Asegurarnos de que el middleware de autenticación ya corrió antes
      if (!req.user) {
        throw new UnauthorizedError("Usuario no autenticado.");
      }

      // 2. Verificar si el rol del usuario está dentro de los roles permitidos
      const hasRole = allowedRoles.includes(req.user.role);

      if (!hasRole) {
        throw new ForbiddenError(
          "No tienes los permisos necesarios para realizar esta acción.",
        );
      }

      next(); // El rol es correcto, procedemos al controlador
    } catch (error) {
      next(error); // Tu errorMiddleware responderá con un 403 o 401 limpio
    }
  };
};
