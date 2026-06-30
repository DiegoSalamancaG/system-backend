import { LandingSection } from "../domain/landingSections";
import { LandingSectionRepository } from "../domain/landingSectionsRepository";
import { ConflictError } from "../../../core/shared/Errors/typeErrors";

export type CreateLandingSectionInput = Partial<LandingSection> & {
  uploadedImages?: Array<{ url: string; category: string; altText?: string }>;
};

export class CreateLandingSectionUseCase {
  constructor(private readonly landingRepository: LandingSectionRepository) {}

  async execute(input: CreateLandingSectionInput): Promise<LandingSection> {
    if (!input.key) {
      throw new Error("La clave (key) de la sección es obligatoria");
    }

    // Validamos consistencia: que no exista una sección con la misma llave
    const existingSection = await this.landingRepository.findByKey(input.key);
    if (existingSection) {
      throw new ConflictError(
        `La sección con la llave '${existingSection.key}' ya existe`,
      );
    }

    return await this.landingRepository.create(input);
  }
}
