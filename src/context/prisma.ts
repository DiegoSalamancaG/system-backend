import { PrismaClient } from "@prisma/client";
import { logger } from "../infrastructure/shared/logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" },
  ],
});

// Canalizamos los eventos de Prisma hacia Winston
prisma.$on("query", (e) => {
  logger.debug(
    `[PRISMA QUERY]: ${e.query} -- Params: ${e.params} -- Duración: ${e.duration}ms`,
  );
});

prisma.$on("warn", (e) => {
  logger.warn(`[PRISMA WARN]: ${e.message}`);
});

prisma.$on("error", (e) => {
  logger.error(`[PRISMA ERROR]: ${e.message}`);
});

// Log de verificación de conexión al arrancar el servidor
export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("[DATABASE] Conexión exitosa a PostgreSQL con Prisma.");
  } catch (error) {
    logger.error("[DATABASE] Error crítico al conectar a PostgreSQL:", error);
    process.exit(1); // Detiene la app si no hay base de datos
  }
};
