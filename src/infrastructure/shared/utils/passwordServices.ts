import bcrypt from "bcrypt";
import { PasswordService } from "../../../core/shared/utils/passwordServiceInterface";

export class BcryptPasswordService implements PasswordService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
