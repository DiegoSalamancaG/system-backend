import crypto from "crypto";
import { UserRepository } from "../../users/domain/userRepository";
import { EmailService } from "../../shared//utils/emailService";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    // Si el usuario no existe, no avisamos al cliente final
    if (!user) return;

    // Generamos un token aleatorio seguro en formato Hex
    const token = crypto.randomBytes(32).toString("hex");
    // El token expirará en 15 minutos a partir de ahora
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Guardamos el token en la base de datos
    await this.userRepository.saveResetToken(user.id, token, expiresAt);

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.fullname,
      token,
    );
  }
}
