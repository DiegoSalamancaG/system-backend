import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../interfaces/authenticatedRequestInterface";
import { MulterFileInMemory } from "../interfaces/fileRequestInterface";

import { HttpResponse } from "../../shared/utils/httpResponse";
import { ProductMapper } from "../../database/mappers/productMapper";
import { logger } from "../../shared/logger";

// Casos de uso
import { CreateProductUseCase } from "../../../core/products/application/createProductUsecase";
import { GetAllProductsUseCase } from "../../../core/products/application/getAllProductsUseCase";
import { GetProductByIdUseCase } from "../../../core/products/application/getProductByIdUseCase";
import { UpdateProductUseCase } from "../../../core/products/application/udpateProductUseCase";
import { DeactivateProductUseCase } from "../../../core/products/application/deactivateProductUseCase";

// Servicio para subir imgs
import { ImageUploadService } from "../../shared/imageUploadService";
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deactivateProductUseCase: DeactivateProductUseCase,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  // Metodos
  createProduct = async (
    req: AuthenticatedRequest & { files: MulterFileInMemory[] },
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedBody = req.body;

      // Extraemos los archivos de Multer
      const files = req.files;
      if (!files || files.length === 0) {
        res
          .status(400)
          .json(
            HttpResponse.error(
              "Debes subir al menos una imagen para el producto.",
            ),
          );
        return;
      }

      // Subida en paralelo a Cloudinary
      const uploadPromises = files.map((file) =>
        this.imageUploadService.uploadImage(file.buffer, "productos"),
      );
      const imageUrls = await Promise.all(uploadPromises);

      // Formateamos el array para el Dominio
      const imagesData = imageUrls.map((url, index) => ({
        url,
        isMain: index === 0,
      }));

      // 5. Llamamos al Caso de Uso
      const newProduct = await this.createProductUseCase.execute({
        name: validatedBody.name,
        description: validatedBody.description,
        price: Number(validatedBody.price),
        stock: Number(validatedBody.stock),
        images: imagesData,
        createdBy: req.user!.id,
      });
      logger.info(
        `[PRODUCT] Nuevo producto creado exitosamente: ${newProduct.name} con ID: ${newProduct.id}`,
      );
      const safeProduct = ProductMapper.toDomainResponse(newProduct as any);
      res
        .status(201)
        .json(HttpResponse.success(safeProduct, "Producto creado con éxito"));
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.getProductByIdUseCase.execute(id);
      res
        .status(200)
        .json(HttpResponse.success(product, "Producto obtenido con éxito"));
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { search } = req.query;
      const products = await this.getAllProductsUseCase.execute(
        search as string,
      );

      const safeProducts = products.map((product) =>
        ProductMapper.toDomainResponse(product as any),
      );
      res
        .status(200)
        .json(
          HttpResponse.success(safeProducts, "Productos obtenidos con éxito"),
        );
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      let productData = { ...req.body };
      if (productData.price !== undefined) {
        productData.price = parseInt(productData.price);
      }

      if (productData.stock !== undefined) {
        productData.stock = parseInt(productData.stock);
      }

      // Rescatamos el producto ACTUAL (con sus imágenes viejas) antes de modificar nada
      const currentProduct = await this.getProductByIdUseCase.execute(id);
      const oldImages = currentProduct?.images || [];

      // ¿Vienen archivos nuevos en la request? (Multer suele dejarlos en req.files)
      if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const files = req.files as Express.Multer.File[];

        // Subimos las nuevas imágenes a Cloudinary usando tu servicio
        const uploadPromises = files.map((file) =>
          this.imageUploadService.uploadImage(file.buffer, "productos"),
        );
        const uploadedUrls = await Promise.all(uploadPromises);

        // Formateamos las nuevas URLs para que coincidan con la estructura que espera tu repositorio
        productData.images = uploadedUrls.map((url, index) => ({
          url,
          isMain: index === 0,
          updatedBy: req.user?.id || "",
        }));
      }

      // Actualizar el producto en la Base de Datos
      const updatedProduct = await this.updateProductUseCase.execute(
        id,
        productData,
      );

      // Borramos las fotos viejas de Cloudinary en segundo plano
      if (productData.images && oldImages.length > 0) {
        oldImages.forEach((img: any) => {
          console.log(img.url);
          this.imageUploadService.deleteImage(img.url).catch((err) => {
            logger.error(
              `[CLOUDINARY] Error al borrar imagen antigua (${img.url}): ${err.message}`,
            );
          });
        });
      }

      logger.info(
        `[PRODUCT] Producto Modificado: ${updatedProduct?.name} con ID: ${updatedProduct?.id}`,
      );

      const safeUpdate = ProductMapper.toDomainResponse(updatedProduct as any);
      res
        .status(200)
        .json(
          HttpResponse.success(safeUpdate, "Producto actualizado con éxito"),
        );
    } catch (error) {
      next(error);
    }
  };

  deactivateProduct = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.deactivateProductUseCase.execute(id);
      logger.info(
        `[PRODUCT] Producto "${id}" desactivado. Acción realizada por Admin ID: ${req.user!.id}`,
      );
      res
        .status(200)
        .json(HttpResponse.success(null, "Producto eliminado con éxito"));
    } catch (error) {
      next(error);
    }
  };
}
