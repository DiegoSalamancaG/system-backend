import { v2 as cloudinary } from "cloudinary";
import { logger } from "../shared/logger";

// 1. Configuramos Cloudinary con nuestras variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ImageUploadService {
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

  public async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // 1. Extraemos las partes de la URL
      const urlParts = imageUrl.split("/");
      const fileNameWithExtension = urlParts.pop(); // "nombre_imagen.jpg"

      if (!fileNameWithExtension) return false;

      const [publicIdWithoutExtension] = fileNameWithExtension.split(".");

      // 🔍 DEBUG 1: Revisa qué carpetas hay antes del archivo
      // Si tus URLs guardan carpeta, usualmente están justo antes del archivo en la URL.
      // Vamos a asumir un extractor más robusto por si usas carpetas:
      const uploadIndex = urlParts.indexOf("upload");
      let publicId = publicIdWithoutExtension;

      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
        // Esto atrapa todo lo que esté entre '/v12345678/' y el nombre del archivo (las carpetas)
        const folderParts = urlParts.slice(uploadIndex + 2); // Salta 'upload' y la versión 'v1234567...'
        if (folderParts.length > 0) {
          publicId = `${folderParts.join("/")}/${publicIdWithoutExtension}`;
        }
      }
      console.log(`[CLOUDINARY] Intentando borrar el public_id: "${publicId}"`);

      // 2. Llamada a la API
      const result = await cloudinary.uploader.destroy(publicId);

      console.log(`[CLOUDINARY] Respuesta del servidor:`, result);

      return result.result === "ok";
    } catch (error) {
      console.error("Error crítico al borrar imagen en Cloudinary:", error);
      return false;
    }
  }
}
