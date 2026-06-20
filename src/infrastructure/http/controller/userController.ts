import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";

// Casos de uso
import { CreateUserUseCase } from "../../../core/users/application/createUserUseCase";
import { DeactivateUserUseCase } from "../../../core/users/application/deactivateUserUseCase";
import { GetAllUserUseCase } from "../../../core/users/application/getAllUsersUseCase";
import { GetUserByIdUseCase } from "../../../core/users/application/getuserByIdUseCase";
import { UpdateUserUseCase } from "../../../core/users/application/updateUserUseCase";

import { UserMapper } from "../../database/mappers/userMapper";
import { HttpResponse } from "../../shared/utils/httpResponse";
import { logger } from "../../shared/logger";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deactivateUserUseCase: DeactivateUserUseCase,
    private readonly getAllUserUseCase: GetAllUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  createUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { fullname, email, password, role } = req.body;
      const newUser = await this.createUserUseCase.execute({
        fullname,
        email,
        password,
        role,
        status: "ACTIVE",
      });

      const safeUser = UserMapper.toDomainResponse(newUser as any);
      logger.info(
        `[USER] Nuevo usuario creado exitosamente: ${newUser.email} con ID: ${newUser.id}`,
      );
      res
        .status(201)
        .json(HttpResponse.success(safeUser, "Usuario registrado con éxito"));
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = await this.getUserByIdUseCase.execute(id);

      res
        .status(200)
        .json(HttpResponse.success(user, "Usuario obtenido con éxito"));
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { fullname, email, role, status, fromDate } = req.query;

      const users = await this.getAllUserUseCase.execute({
        fullname: fullname as string,
        email: email as string,
        role: role as string,
        status: status as string,
        fromDate: fromDate as string,
      });

      const safeUsers = users.map((user) => UserMapper.toDomainResponse(user));
      res
        .status(200)
        .json(HttpResponse.success(safeUsers, "Usuarios obtenidos con éxito"));
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userData = req.body;
      const updatedUser = await this.updateUserUseCase.execute(id, userData);
      logger.info(
        `[USER] Usuario actualizado ${updatedUser?.email}. Acción realizada por Admin ID: ${req.user!.id}`,
      );
      const safeUser = UserMapper.toDomainResponse(updatedUser as any);
      res
        .status(200)
        .json(HttpResponse.success(safeUser, "Usuario actualizado con éxito"));
    } catch (error) {
      next(error);
    }
  };

  deactivateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.deactivateUserUseCase.execute(id);
      logger.info(
        `[USER] Usuario "${id}" desactivado  Acción realizada por Admin ID: ${req.user!.id}`,
      );
      res
        .status(200)
        .json(HttpResponse.success(null, "Usuario desactivado con éxito"));
    } catch (error) {
      next(error);
    }
  };
}
