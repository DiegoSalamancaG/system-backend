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
        isActive: productData.isActive,
        createdBy: productData.createdBy,
        images: {
          create: productData.images?.map((img) => ({
            url: img.url,
            isMain: img.isMain,
            category: "PRODUCT",
            createdBy: productData.createdBy,
          })),
        },
      },
      include: {
        images: true,
      },
    });
    return ProductMapper.toDomainResponse(createdProduct);
  }

  // Metodo para buscar por ID
  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!product) return null;
    return ProductMapper.toDomainResponse(product);
  }

  // Metodo para buscar por nombre
  async findByName(name: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: { name },
      include: { images: true },
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
      include: { images: true },
    });
    return products.map((p) => ProductMapper.toDomain(p));
  }

  // Metodo para actualizar un producto
  async update(id: string, productData: Partial<Product>): Promise<Product> {
    const { images, ...restOfProductData } = productData;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...restOfProductData,

        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((img) => ({
              url: img.url,
              isMain: img.isMain,
              category: "PRODUCT",
              createdBy: productData.updatedBy || "",
            })),
          },
        }),
      },
      include: {
        images: true,
      },
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
