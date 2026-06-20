import { ProductRepository } from "../domain/productRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class DeactivateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const productExists = await this.productRepository.findById(id);
    if (!productExists) {
      throw new NotFoundError(
        `No se puede desactivar. Producto con ID ${id} no encontrado`,
      );
    }
    await this.productRepository.deactivate(id);
  }
}
