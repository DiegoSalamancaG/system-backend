import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";

// Casos de uso
import { CreateLandingSectionUseCase } from "../../../core/landingSection/application/createLandingSectionUseCase";
import { GetAllLandingSectionsUseCase } from "../../../core/landingSection/application/getAllLangindSections";
import { UpdateLandingSectionUseCase } from "../../../core/landingSection/application/updatelandingSectionUseCase";
import { GetLandingSectionByIdUseCase } from "../../../core/landingSection/application/getLandingSectionByIdUseCase";

import { HttpResponse } from "../../shared/utils/httpResponse";
import { logger } from "../../shared/logger";
import { ImageUploadService } from "../../shared/imageUploadService";
import { MulterFileInMemory } from "../interfaces/fileRequestInterface";

export class LandingSectionController {
  constructor(
    private readonly createLandingSectionUseCase: CreateLandingSectionUseCase,
    private readonly getAllLandignSectionUseCase: GetAllLandingSectionsUseCase,
    private readonly updateLandingSectionUseCase: UpdateLandingSectionUseCase,
    private readonly getLandingSectionByIdUseCase: GetLandingSectionByIdUseCase,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  createSection = async (
    req: AuthenticatedRequest & { files: MulterFileInMemory[] },
    res: Response,
    Next: NextFunction,
  ): Promise<void> => {
    let uploadedImageUrls: string[] = [];
    try {
      // Extraemos el body y la categoría si viene desde el frontend
      const { key, title, content, category } = req.body;

      // Extraemos los archivos de Multer
      const files = req.files;
      if (!files || files.length === 0) {
        res
          .status(400)
          .json(
            HttpResponse.error(
              "Debes subir al menos una imagen para la sección de la landing.",
            ),
          );
        return;
      }

      // Subida en paralelo a Cloudinary (Cambiamos la carpeta a 'landing')
      const uploadPromises = files.map(async (file) => {
        const url = await this.imageUploadService.uploadImage(
          file.buffer,
          "landing",
        );
        uploadedImageUrls.push(url);
        return url;
      });
      uploadedImageUrls = await Promise.all(uploadPromises);

      // Formateamos el array usando las variables correctas
      const imagesData = uploadedImageUrls.map((url) => ({
        url: url,
        category: category || "LANDING",
        altText: title ? `Imagen de la sección ${title}` : undefined,
      }));

      // Llamamos al Caso de uso pasándole 'uploadedImages'
      const newSection = await this.createLandingSectionUseCase.execute({
        key: key,
        title: title,
        content: content,
        uploadedImages: imagesData,
        createdBy: req.user!.id,
      });

      logger.info(
        `[LANDING] Nueva sección creada: ${newSection.key} por usuario ${req.user?.id}`,
      );

      res
        .status(201)
        .json(HttpResponse.success(newSection, "Sección creada con éxito"));
    } catch (error) {
      await this.deleteUploadedImages(uploadedImageUrls);
      Next(error);
    }
  };

  getAllSections = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const sections = await this.getAllLandignSectionUseCase.execute();
      res
        .status(200)
        .json(
          HttpResponse.success(sections, "Secciones de la Landing recuperadas"),
        );
    } catch (error) {
      next(error);
    }
  };

  updateSection = async (
    req: AuthenticatedRequest & { files: MulterFileInMemory[] },
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let uploadedImageUrls: string[] = [];
    try {
      const id = req.params.id as string;
      let sectionData = { ...req.body };
      const files = req.files;
      // Rescatamos la sección ACTUAL (con sus imágenes viejas) antes de modificar nada
      const currentSection =
        await this.getLandingSectionByIdUseCase.execute(id);
      const oldImages = currentSection?.images || [];

      // ¿Vienen archivos nuevos en la request?
      if (files && files.length > 0) {
        // Subimos las nuevas imágenes a Cloudinary usando tu servicio
        const uploadPromises = files.map(async (file) => {
          const url = await this.imageUploadService.uploadImage(
            file.buffer,
            "landing",
          );
          uploadedImageUrls.push(url);
          return url;
        });
        uploadedImageUrls = await Promise.all(uploadPromises);

        // Formateamos las nuevas URLs para la estructura que espera tu payload/repositorio
        sectionData.uploadedImages = uploadedImageUrls.map((url) => ({
          url,
          category: sectionData.category || "LANDING",
          altText: sectionData.title
            ? `Imagen actualizada de la sección ${sectionData.title}`
            : undefined,
        }));
      }

      // Actualizar la sección en la Base de Datos
      const updatedSection = await this.updateLandingSectionUseCase.execute(
        id,
        {
          ...sectionData,
          updatedBy: req.user!.id,
        },
      );

      // Borramos las fotos viejas de Cloudinary en segundo plano
      if (sectionData.uploadedImages && oldImages.length > 0) {
        oldImages.forEach((img: any) => {
          this.imageUploadService.deleteImage(img.url).catch((err) => {
            logger.error(
              `[CLOUDINARY] Error al borrar imagen antigua de la landing (${img.url}): ${err.message}`,
            );
          });
        });
      }

      logger.info(
        `[LANDING] Sección modificada: ${updatedSection.key} con ID: ${id} por usuario ${req.user?.id}`,
      );

      res
        .status(200)
        .json(
          HttpResponse.success(updatedSection, "Sección actualizada con éxito"),
        );
    } catch (error) {
      await this.deleteUploadedImages(uploadedImageUrls);
      next(error);
    }
  };

  private async deleteUploadedImages(imageUrls: string[]): Promise<void> {
    await Promise.all(
      imageUrls.map((url) =>
        this.imageUploadService.deleteImage(url).catch((err) => {
          logger.error(
            `[CLOUDINARY] Error al limpiar imagen subida de landing (${url}): ${err.message}`,
          );
        }),
      ),
    );
  }
}
