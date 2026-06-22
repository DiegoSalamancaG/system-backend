import { v2 as cloudinary } from "cloudinary";
import { logger } from "../shared/logger";

// 1. Configuramos Cloudinary con nuestras variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ImageUploadService {
  /**
   * Sube una imagen recibida en memoria (Buffer) directamente a Cloudinary
   * @param fileBuffer Buffer del archivo entregado por Multer
   * @param folder Carpeta dentro de Cloudinary (ej: 'productos', 'portafolio')
   * @returns Promesa con la URL pública de la imagen
   */
  async uploadImage(fileBuffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `tatto_studio/${folder}`, // Organiza tus archivos por carpetas
          resource_type: "image",
          allowed_formats: ["jpg", "png", "jpeg", "webp"],
        },
        (error, result) => {
          if (error) {
            logger.error(
              `[CLOUDINARY] Error al subir imagen a la carpeta ${folder}:`,
              error,
            );
            return reject(new Error("Error al procesar y subir la imagen."));
          }

          // Retornamos la URL segura
          resolve(result!.secure_url);
        },
      );

      // Escribimos el buffer en el stream de subida
      uploadStream.end(fileBuffer);
    });
  }
}
