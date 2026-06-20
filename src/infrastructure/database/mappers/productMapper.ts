import { Product as PrismaProductModel } from "@prisma/client";
import { Product } from "../../../core/products/domain/product";

export class ProductMapper {
  // Transforma el modelo de la base de datos al objeto del dominio
  static toDomain(prismaProduct: PrismaProductModel): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      stock: prismaProduct.stock,
      imageUrl: prismaProduct.imageUrl,
      isActive: prismaProduct.isActive,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      createdBy: prismaProduct.createdBy,
      updatedBy: prismaProduct.updatedBy,
    };
  }

  static toDomainResponse(
    prismaProduct: PrismaProductModel,
  ): Pick<
    Product,
    "id" | "name" | "description" | "price" | "stock" | "imageUrl" | "isActive"
  > {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      stock: prismaProduct.stock,
      imageUrl: prismaProduct.imageUrl,
      isActive: prismaProduct.isActive,
    };
  }
}
