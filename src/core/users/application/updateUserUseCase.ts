import { UserRepository } from "../domain/userRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";
import { User } from "../domain/user";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, userData: Partial<User>) {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new NotFoundError(
        `No se puede Actualizar. Usuario con ID ${id} no encontrado`,
      );
    }
    const updatedUser = await this.userRepository.update(id, userData);
    return updatedUser;
  }
}
