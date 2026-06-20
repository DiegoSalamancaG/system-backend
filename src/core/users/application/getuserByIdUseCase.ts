import { UserRepository } from "../domain/userRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
}
