export type GalleryCategoryType =
  | "PRODUCT"
  | "PORTFOLIO"
  | "AVAILABLE_DESIGN"
  | "BANNER"
  | "LANDING"
  | string;

export interface LandingImage {
  id: string;
  url: string;
  altText: string | null;
  category: GalleryCategoryType;
  landingSectionId: string;
  createdAt: Date;
}

export class LandingSection {
  constructor(
    public readonly id: string,
    public readonly key: string,
    public readonly title: string,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy?: string | null,
    public readonly updatedBy?: string | null,
    public readonly images?: LandingImage[],
  ) {}
}
