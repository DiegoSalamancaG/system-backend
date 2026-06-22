import { ProductImageDomain } from "../../domain/product";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: ProductImageDomain[]; // 🚀 Las imágenes procesadas deben viajar aquí
  createdBy: string;
}
