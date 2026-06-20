import { CustomError } from "./customError";

// Error 400: Datos de entrada inválidos (ej. precio negativo)
export class BadRequestError extends CustomError {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

// Error 401: No autenticadoo token inválido
export class UnauthorizedError extends CustomError {
  readonly statusCode = 401;
  constructor(message: string) {
    super(message);
  }
}

// Error 403: No autorizado (ej. rol insuficiente)
export class ForbiddenError extends CustomError {
  readonly statusCode = 403;
  constructor(message: string) {
    super(message);
  }
}

// Error 404: Recurso no encontrado
export class NotFoundError extends CustomError {
  readonly statusCode = 404;
  constructor(message: string) {
    super(message);
  }
}

// Error 409: Conflicto (ej. email ya registrado)
export class ConflictError extends CustomError {
  readonly statusCode = 409;
  constructor(message: string) {
    super(message);
  }
}
// Error 422: Validación fallida (ej. formato de email inválido)
export class ValidationError extends CustomError {
  readonly statusCode = 422;
  constructor(message: string) {
    super(message);
  }
}

// Error 500: Error genérico del servidor
export class InternalServerError extends CustomError {
  readonly statusCode = 500;
  constructor(message: string) {
    super(message);
  }
}
