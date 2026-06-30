import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../../core/auth/application/registerUserUseCase";
import { LoginUseCase } from "../../../core/auth/application/loginUseCase";
import { UserMapper } from "../../database/mappers/userMapper";
import { HttpResponse } from "../../shared/utils/httpResponse";
import { logger } from "../../shared/logger";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
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
}
