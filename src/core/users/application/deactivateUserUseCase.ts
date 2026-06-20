import { UserRepository } from "../domain/userRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class DeactivateUserUseCase {
  constructor(private readonly userRespository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.userRespository.findById(id);
    if (!userExists) {
      throw new NotFoundError(
        `No se puede desactivar. Usuario con ID ${id} no encontrado`,
      );
    }
    await this.userRespository.deactivate(id);
  }
}
