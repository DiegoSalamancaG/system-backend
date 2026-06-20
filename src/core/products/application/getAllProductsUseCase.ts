import { ProductRepository } from "../domain/productRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class GetAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(search?: string) {
    const products = await this.productRepository.findAll(search);
    if (!products) {
      throw new NotFoundError(`Productos no encontrado`);
    }
    return products;
  }
}
