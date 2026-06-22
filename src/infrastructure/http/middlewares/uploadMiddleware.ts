import multer from "multer";

// Guardamos el archivo temporalmente en la memoria RAM
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite máximo: 5MB por imagen
  },
  fileFilter: (req, file, cb) => {
    // Validamos que sea un tipo de imagen permitido
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("El archivo subido no es una imagen válida."));
    }
  },
});
