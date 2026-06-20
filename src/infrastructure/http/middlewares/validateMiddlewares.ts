import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateRequest = (schema: ZodType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Intenta validar la request (body, query o params)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapeamos los errores
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path[1] || issue.path[0],
          message: issue.message,
        }));

        res.status(400).json({
          status: "fail",
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
};
