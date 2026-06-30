import { UserRepository } from "../../users/domain/userRepository";
import { PasswordService } from "../../shared/utils/passwordServiceInterface";
import { TokenServices } from "../../shared/auth/tokenServices";
import { UnauthorizedError } from "../../shared/Errors/typeErrors";

interface loginResponse {
  token: string;
  user: { id: string; fullname: string; email: string; role: string };
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenServices: TokenServices,
  ) {}

  async execute(email: string, password: string): Promise<loginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Credenciales invalidas");
    }

    if (user.status !== "ACTIVE") {
      throw new UnauthorizedError("Usuario inactivo o bloqueado");
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciales invalidas");
    }

    const token = this.tokenServices.generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    };
  }
}
