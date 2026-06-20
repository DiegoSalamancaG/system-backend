import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  limiter,
  corsMiddleware,
} from "./infrastructure/http/middlewares/securityMiddleware";
import { rootRouter } from "./infrastructure/http/routes/index";
import { errorMiddleware } from "./infrastructure/http/middlewares/errorMiddlewares";
import { logger } from "./infrastructure/shared/logger";
import { connectDB } from "./context/prisma";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(corsMiddleware);
app.use(limiter);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Router main
app.use("/api/v1", rootRouter);

// Errores middleware
app.use(errorMiddleware);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
