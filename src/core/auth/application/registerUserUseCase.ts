import { UserRepository } from "../../users/domain/userRepository";
import { User } from "../../users/domain/user";
import { PasswordService } from "../../shared/utils/passwordServiceInterface";
import { BadRequestError } from "../../shared/Errors/typeErrors";

export class RegisterUserUseCase {
  // Inyectamos el repositorio Y el servicio de passwords abstractos
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    // 1. Validar que el email no esté tomado
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError(
        "El correo electrónico ya se encuentra registrado",
      );
    }

    // 2. Encriptar la contraseña usando el contrato del dominio
    const hashedPassword = await this.passwordService.hashPassword(
      userData.password,
    );

    // 3. Guardar el usuario con la contraseña encriptada
    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return newUser;
  }
}
