import { Request, Response, NextFunction } from "express";
import { HttpResponse } from "../../shared/utils/httpResponse";
import { ProductMapper } from "../../database/mappers/productMapper";
// Casos de uso
import { CreateProductUseCase } from "../../../core/products/application/createProductUsecase";
import { GetAllProductsUseCase } from "../../../core/products/application/getAllProductsUseCase";
import { GetProductByIdUseCase } from "../../../core/products/application/getProductByIdUsecase";
import { UpdateProductUseCase } from "../../../core/products/application/udpateProductUseCase";
import { DeactivateProductUseCase } from "../../../core/products/application/deactivateProductUseCase";

export class ProductController {
  // Inyección de dependecias
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deactivateProductUseCase: DeactivateProductUseCase,
  ) {}

  createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { name, description, price, stock, imageUrl } = req.body;

      const product = await this.createProductUseCase.execute({
        name,
        description,
        price,
        stock,
        imageUrl,
        isActive: true,
      });
      const safeProduct = ProductMapper.toDomainResponse(product as any);
      res
        .status(201)
        .json(HttpResponse.success(safeProduct, "Producto creado con éxito"));
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (
    req: Request,
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
    req: Request,
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
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updatedProduct = await this.updateProductUseCase.execute(
        id,
        req.body,
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
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.deactivateProductUseCase.execute(id);
      res
        .status(200)
        .json(HttpResponse.success(null, "Producto eliminado con éxito"));
    } catch (error) {
      next(error);
    }
  };
}
