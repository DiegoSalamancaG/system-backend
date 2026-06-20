import jwt from "jsonwebtoken";
import { TokenServices } from "../../../core/shared/auth/tokenServices";

export class JwtTokenServices implements TokenServices {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: number;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET!;
    this.JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN!);
  }

  generateToken(payload: { userId: string; role: string }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): { userId: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET!) as {
        userId: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
