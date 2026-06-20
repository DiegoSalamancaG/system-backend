import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, errors } = format;

// 1. Definimos un formato personalizado para la consola
const logFormat = printf(({ level, message, timestamp, stack }) => {
  // Si hay un error con stack trace (de un catch), lo mostramos, si no, el mensaje normal
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Captura el stack trace automáticamente
    format.json(), // Por defecto en formato JSON (ideal para producción)
  ),
  transports: [
    // Guardar errores en un archivo independiente
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // Guardar todos los logs combinados
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// 2. Si no estamos en producción, pintamos en consola con colores y formato legible
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
  );
}
