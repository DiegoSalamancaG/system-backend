export interface TokenServices {
  generateToken(payload: { userId: string; role: string }): string;
  verifyToken(token: string): { userId: string; role: string } | null;
}
