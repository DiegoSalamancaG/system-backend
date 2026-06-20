import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../../core/users/application/registerUserUseCase";
import { LoginUseCase } from "../../../core/auth/application/loginUseCase";
import { UserMapper } from "../../database/mappers/userMapper";
import { HttpResponse } from "../../shared/utils/httpResponse";

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
      const { fullname, email, password, role } = req.body;

      const newUser = await this.registerUseCase.execute({
        fullname,
        email,
        password,
        role,
        status: "ACTIVE",
      });

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
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute(email, password);

      res.status(200).json(HttpResponse.success(result, "Login exitoso"));
    } catch (error) {
      next(error);
    }
  };
}
