export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: ProductImageDomain[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface ProductImageDomain {
  url: string;
  isMain: boolean;
}
