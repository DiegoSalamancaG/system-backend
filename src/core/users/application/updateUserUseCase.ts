import { UserRepository } from "../domain/userRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";
import { User } from "../domain/user";
import { PasswordService } from "../../shared/utils/passwordServiceInterface";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(id: string, userData: Partial<User>) {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new NotFoundError(
        `No se puede Actualizar. Usuario con ID ${id} no encontrado`,
      );
    }
    const dataToUpdate = { ...userData };
    if (dataToUpdate.password) {
      dataToUpdate.password = await this.passwordService.hashPassword(
        dataToUpdate.password,
      );
    }

    const updatedUser = await this.userRepository.update(id, dataToUpdate);
    return updatedUser;
  }
}
