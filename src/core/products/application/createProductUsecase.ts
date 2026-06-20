import { ProductRepository } from "../domain/productRepository";
import { Product } from "../domain/product";
import { BadRequestError } from "../../shared/Errors/typeErrors";

export class CreateProductUseCase {
  // private = declara e inicia auto
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    // Reglas de negocio
    const { name } = productData;
    const existingProduct = await this.productRepository.findByName(name);
    if (existingProduct) {
      throw new BadRequestError(
        `Ya existe un producto registrado con el nombre: ${name}`,
      );
    }

    return await this.productRepository.create(productData);
  }
}
