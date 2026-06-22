import {
  Product as PrismaProductModel,
  GalleryImage as GalleryImagePrisma,
} from "@prisma/client";
import { Product } from "../../../core/products/domain/product";

// Definir tipo de prisma
type ProductWithImages = PrismaProductModel & {
  images: GalleryImagePrisma[];
};

export class ProductMapper {
  // Transforma el modelo de la base de datos al objeto del dominio
  static toDomain(prismaProduct: ProductWithImages): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      stock: prismaProduct.stock,
      isActive: prismaProduct.isActive,
      images: (prismaProduct.images || []).map((img) => ({
        url: img.url,
        isMain: img.isMain,
      })),
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      createdBy: prismaProduct.createdBy,
      updatedBy: prismaProduct.updatedBy,
    };
  }

  static toDomainResponse(
    prismaProduct: ProductWithImages,
  ): Pick<
    Product,
    "id" | "name" | "description" | "price" | "stock" | "isActive" | "images"
  > {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      stock: prismaProduct.stock,
      isActive: prismaProduct.isActive,
      images: prismaProduct.images,
    };
  }
}
