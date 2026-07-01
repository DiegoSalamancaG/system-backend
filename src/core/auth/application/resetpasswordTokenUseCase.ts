import { UserRepository } from "../../users/domain/userRepository";
import { BcryptPasswordService } from "../../../infrastructure/shared/utils/passwordServices";
import { BadRequestError } from "../../shared/Errors/typeErrors";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptPasswordService: BcryptPasswordService,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const tokenData = await this.userRepository.findResetToken(token);

    if (!tokenData) {
      throw new BadRequestError("El token de recuperación es inválido.");
    }

    // Verificar si ya expiró
    if (new Date() > tokenData.expiresAt) {
      await this.userRepository.deleteResetToken(token); // Limpieza
      throw new BadRequestError(
        "El token ha expirado. Por favor, solicita uno nuevo.",
      );
    }

    // Hashear la nueva contraseña
    const hashedPassword =
      await this.bcryptPasswordService.hashPassword(newPassword);

    //Actualizar la contraseña del usuario y borrar el token usado
    await this.userRepository.updatePassword(tokenData.userId, hashedPassword);
    await this.userRepository.deleteResetToken(token);
  }
}
