import { Resend } from "resend";
import { EmailService } from "../../core/shared/utils/emailService";
import { logger } from "./logger";

export class ResendEmailService implements EmailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    // Mientras estés en modo de prueba, Resend solo te deja enviar correos a ti mismo
    // usando 'onboarding@resend.dev'. Cuando verifiques tu dominio, usas 'no-reply@tustudio.com'
    this.fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    // Construimos la URL que apunta al Frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      const response = await this.resend.emails.send({
        from: `MacaGuiselle <${this.fromEmail}>`,
        to: [to],
        subject: "Restablece tu contraseña - MacaGuiselle",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Hola, ${name}</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en nuestro estudio de tatuajes. 
              Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">
              Este enlace expirará en 15 minutos.<br>
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
              <a href="${resetUrl}" style="color: #0066cc;">${resetUrl}</a>
            </p>
          </div>
        `,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      logger.info(`[EMAIL] Correo de recuperación enviado con éxito a: ${to}`);
    } catch (error: any) {
      logger.error(
        `[EMAIL ERROR] No se pudo enviar el correo a ${to}: ${error.message}`,
      );
      throw new Error("Error al enviar el correo de recuperación.");
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    try {
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>¡Te damos la bienvenida!</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
            .header { background-color: #0a0a0a; padding: 30px; text-align: center; border-bottom: 2px solid #b38f4f; }
            .header h1 { color: #b38f4f; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
            .content { padding: 40px 30px; line-height: 1.6; }
            .content h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
            .content p { color: #a0a0a0; font-size: 16px; }
            .cta-container { text-align: center; margin: 30px 0; }
            .btn { background-color: #b38f4f; color: #121212; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; font-size: 16px; display: inline-block; transition: background-color 0.3s; }
            .footer { background-color: #0a0a0a; padding: 20px; text-align: center; font-size: 12px; color: #555; border-top: 1px solid #222; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Maca Guiselle</h1>
            </div>
            <div class="content">
              <h2>¡Hola, ${name}!</h2>
              <p>Tu cuenta ha sido creada con éxito en nuestra plataforma. Nos alegra un montón tenerte con nosotros.</p>
              <p>A partir de ahora, podrás gestionar tus datos, revisar la disponibilidad de la agenda en tiempo real y asegurar tus próximas horas directamente desde tu perfil, sin complicaciones.</p>
              <div class="cta-container">
                <a href="https://www.macaguiselle.cl/api/v1/login" class="btn">Iniciar Sesión</a>
              </div>
              <p>¡Nos vemos pronto en el estudio!</p>
            </div>
            <div class="footer">
              <p>&copy; 2026 Maca Guiselle. Todos los derechos reservados.</p>
              <p>Este es un correo automático, no es necesario que lo respondas a menos que necesites soporte.</p>
            </div>
          </div>
        </body>
      </html>
    `;

      await this.resend.emails.send({
        from: this.fromEmail,
        to: [to],
        subject: "¡Tu cuenta ha sido creada con éxito!",
        html: htmlContent,
      });

      logger.info(`[EMAIL]: Correo de bienvenida enviado exitosamente a ${to}`);
    } catch (error: any) {
      logger.error(`[EMAIL ERROR]: Fallo al enviar bienvenida a ${to}:`, error);
    }
  }
}
