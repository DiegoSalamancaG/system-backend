import { Product } from "./product";

export interface ProductRepository {
  create(
    product: Omit<
      Product,
      "id" | "createdAt" | "updatedAt" | "createdBy" | "udatedBy"
    >,
  ): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findAll(filters: any): Promise<Product[]>;
  update(id: string, productData: Partial<Product>): Promise<Product | null>;
  deactivate(id: string): Promise<void | null>;
}
