import { UserRepository } from "../../users/domain/userRepository";
import { User } from "../../users/domain/user";
import { PasswordService } from "../../shared/utils/passwordServiceInterface";
import { BadRequestError } from "../../shared/Errors/typeErrors";
import { EmailService } from "../../shared/utils/emailService";

export class RegisterUserUseCase {
  // Inyectamos el repositorio Y el servicio de passwords abstractos
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
  ) {}

  async execute(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    // Validar que el email no esté tomado
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError(
        "El correo electrónico ya se encuentra registrado",
      );
    }

    // Encriptar la contraseña usando el contrato del dominio
    const hashedPassword = await this.passwordService.hashPassword(
      userData.password,
    );

    // Guardar el usuario con la contraseña encriptada
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Enviar correo de bienvenida
    await this.emailService.sendWelcomeEmail(newUser.email, newUser.fullname);

    return newUser;
  }
}
