import { LandingSection } from "./landingSections";

export type CreateLandingSectionInput = Partial<LandingSection> & {
  uploadedImages?: Array<{ url: string; category: string; altText?: string }>;
};

export type UpdateLandingSectionInput = Partial<LandingSection> & {
  uploadedImages?: Array<{ url: string; category: string; altText?: string }>;
};

export interface LandingSectionRepository {
  create(section: CreateLandingSectionInput): Promise<LandingSection>;
  findByKey(key: string): Promise<LandingSection | null>;
  findById(id: string): Promise<LandingSection | null>;
  findAll(): Promise<LandingSection[]>;
  update(
    id: string,
    sectionData: UpdateLandingSectionInput,
  ): Promise<LandingSection>;
}
