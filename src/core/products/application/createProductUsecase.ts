import { ProductRepository } from "../domain/productRepository";
import { Product } from "../domain/product";
import { BadRequestError } from "../../shared/Errors/typeErrors";
import { CreateProductInput } from "../application/dto/createProductInput";

export class CreateProductUseCase {
  // private = declara e inicia auto
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const productData: Omit<Product, "id"> = {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      isActive: true,
      images: input.images,
      createdBy: input.createdBy,
    };

    // Reglas de negocio
    const productName = productData.name;
    const existingProduct =
      await this.productRepository.findByName(productName);
    if (existingProduct) {
      throw new BadRequestError(
        `Ya existe un producto registrado con el nombre: ${productName}`,
      );
    }

    return await this.productRepository.create(productData);
  }
}
