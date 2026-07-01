export interface EmailService {
  sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void>;
  sendWelcomeEmail(to: string, name: string): Promise<void>;
}
