import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    fullname: z
      .string({ message: "El nombre completo es obligatorio" })
      .min(3, "El nombre completo debe tener al menos 3 caracteres"),
    email: z
      .string({ message: "El correo electrónico es obligatorio" })
      .email("El correo electrónico no es válido"),
    password: z
      .string({ message: "La contraseña es obligatoria" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.string().optional().default("CLIENT"),
  }),
});
