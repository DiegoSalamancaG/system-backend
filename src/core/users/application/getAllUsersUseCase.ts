import { UserRepository, UserFilters } from "../domain/userRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class GetAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(filters: UserFilters) {
    const users = await this.userRepository.findAll(filters);
    if (!users) {
      throw new NotFoundError("Usuarios no encontrados");
    }
    return users;
  }
}
