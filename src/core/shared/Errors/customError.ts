export abstract class CustomError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);

    // Restauramos el prototipo para que el 'instanceof' de JS funcione impecable
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
