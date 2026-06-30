import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullname: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Formato de correo inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Formato de correo inválido"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  }),
});
