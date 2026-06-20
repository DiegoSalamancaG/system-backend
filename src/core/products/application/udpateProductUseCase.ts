import { ProductRepository } from "../domain/productRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";
import { Product } from "../domain/product";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, productData: Partial<Product>) {
    const productExists = await this.productRepository.findById(id);
    if (!productExists) {
      throw new NotFoundError(
        `No se puede actualizar. Producto con ID ${id} no encontrado`,
      );
    }
    return await this.productRepository.update(id, productData);
  }
}
