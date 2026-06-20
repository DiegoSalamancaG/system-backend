import { ProductRepository } from "../domain/productRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class GetProductByNameUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(name: string) {
    const product = await this.productRepository.findByName(name);
    if (!product) {
      throw new NotFoundError(`Producto ${name} no encontrado`);
    }
    return product;
  }
}
