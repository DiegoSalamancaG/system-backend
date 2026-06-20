import express from "express";
import dotenv from "dotenv";
import {
  limiter,
  corsMiddleware,
} from "./infrastructure/http/middlewares/securityMiddleware";
import { rootRouter } from "./infrastructure/http/routes/index";
import { errorMiddleware } from "./infrastructure/http/middlewares/errorMiddlewares";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(corsMiddleware);
app.use(limiter);

// Router main
app.use("/api/v1", rootRouter);

// Errores middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
