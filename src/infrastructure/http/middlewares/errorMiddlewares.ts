import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../../core/shared/Errors/customError";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";

export const errorMiddleware = (
  error: Error,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  // Si es un error controlado por nuestro dominio
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      status: "fail",
      message: error.message,
    });
    return;
  }

  // Si es un error inesperado de infraestructura (ej: bug de sintaxis, caída de BD)
  console.error("Error no controlado:", error);

  res.status(500).json({
    status: "error",
    message: "Algo salió mal en el servidor interno",
  });
};
