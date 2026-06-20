import { ProductRepository } from "../domain/productRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }
}
