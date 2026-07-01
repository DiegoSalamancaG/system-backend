import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../../core/auth/application/registerUserUseCase";
import { LoginUseCase } from "../../../core/auth/application/loginUseCase";
import { UserMapper } from "../../database/mappers/userMapper";
import { HttpResponse } from "../../shared/utils/httpResponse";
import { logger } from "../../shared/logger";
import { ForgotPasswordUseCase } from "../../../core/auth/application/forgotPasswordUseCase";
import { ResetPasswordUseCase } from "../../../core/auth/application/resetpasswordTokenUseCase";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly forgotPasswordUSeCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { fullname, email, password } = req.body;

      const newUser = await this.registerUseCase.execute({
        fullname,
        email,
        password,
        role: "CLIENT",
        status: "ACTIVE",
      });
      logger.info(
        `[USER] Nuevo usuario registrado exitosamente: ${newUser.email} con ID: ${newUser.id}`,
      );

      const safeUser = UserMapper.toDomainResponse(newUser);
      res
        .status(201)
        .json(
          HttpResponse.success(
            { user: safeUser },
            "Usuario registrado con éxito",
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { email, password } = req.body;
    try {
      const result = await this.loginUseCase.execute(email, password);
      logger.info(`[AUTH] Login exitoso para el usuario: ${email}`);

      res.status(200).json(HttpResponse.success(result, "Login exitoso"));
    } catch (error) {
      next(error);
      logger.warn(
        `[AUTH] Intento de login fallido para el usuario: ${email} - Motivo: Credenciales inválidas`,
      );
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res
          .status(400)
          .json(HttpResponse.error("El correo electrónico es requerido."));
        return;
      }

      await this.forgotPasswordUSeCase.execute(email);

      res
        .status(200)
        .json(
          HttpResponse.success(
            null,
            "Si el correo se encuentra registrado, recibirás un enlace de recuperación en unos minutos.",
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res
          .status(400)
          .json(
            HttpResponse.error(
              "El token y la nueva contraseña son requeridos.",
            ),
          );
        return;
      }

      await this.resetPasswordUseCase.execute(token, newPassword);

      res
        .status(200)
        .json(
          HttpResponse.success(
            null,
            "Contraseña actualizada con éxito. Ya puedes iniciar sesión.",
          ),
        );
    } catch (error) {
      next(error);
    }
  };
}
