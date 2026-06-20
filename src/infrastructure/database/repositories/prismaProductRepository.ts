import { ProductRepository } from "../../../core/products/domain/productRepository";
import { ProductMapper } from "../mappers/productMapper";
import { Product } from "../../../core/products/domain/product";
import { prisma } from "../../../context/prisma";

export class PrismaProductRepository implements ProductRepository {
  // Metodo para crear
  async create(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    // Prisma se encarga de mapear el objeto al modelo real de la BD
    const createdProduct = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        imageUrl: productData.imageUrl,
        isActive: productData.isActive,
        createdBy: productData.createdBy,
      },
    });
    return createdProduct;
  }

  // Metodo para buscar por ID
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) return null;
    return ProductMapper.toDomainResponse(product);
  }

  // Metodo para buscar por nombre
  async findByName(name: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: { name },
    });
    if (!product) return null;
    return ProductMapper.toDomainResponse(product);
  }

  // Metodo para listar todos los productos activos
  async findAll(search?: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
    });
    return products.map((p) => ProductMapper.toDomain(p));
  }

  // Metodo para actualizar un producto
  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    });
    return ProductMapper.toDomain(updatedProduct);
  }

  // Metodo para eliminar un producto (soft delete)
  async deactivate(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
