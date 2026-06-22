import { z } from "zod";

// Definimos el esquema de validación técnica (lo que Express va a recibir)
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "El nombre es obligatorio" })
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z
      .string()
      .max(255, "La descripción no puede pasar los 255 caracteres"),
    price: z.coerce
      .number({ message: "El precio es obligatorio" })
      .int()
      .positive("El precio debe ser un número positivo"),
    stock: z.coerce
      .number()
      .int()
      .nonnegative("El stock no puede ser negativo")
      .optional(),
  }),
});
