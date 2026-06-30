import { LandingSection } from "../domain/landingSections";
import {
  LandingSectionRepository,
  UpdateLandingSectionInput,
} from "../domain/landingSectionsRepository";
import { NotFoundError } from "../../..//core/shared/Errors/typeErrors";

export class UpdateLandingSectionUseCase {
  constructor(private readonly landingRepository: LandingSectionRepository) {}

  async execute(
    id: string,
    input: UpdateLandingSectionInput,
  ): Promise<LandingSection> {
    const existingSection = await this.landingRepository.findById(id);
    if (!existingSection) {
      throw new NotFoundError(
        "La sección de la landing que intentas actualizar no existe",
      );
    }

    return await this.landingRepository.update(id, input);
  }
}
