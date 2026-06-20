import cors from "cors";
import { rateLimit } from "express-rate-limit";

export const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*", // Permitir todas las fuentes (ajusta según tus necesidades)
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
});

export const limiter = rateLimit({
  windowMs: 30000, // 30 seg
  limit: 4,
  message: {
    status: "fail",
    message: "Demasiadas peticiones, intentar mas tarde",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false, //desactivar cabeceras antiguas
});
