import { LandingSection } from "../domain/landingSections";
import { LandingSectionRepository } from "../domain/landingSectionsRepository";

export class GetAllLandingSectionsUseCase {
  constructor(
    private readonly landingSectionRepository: LandingSectionRepository,
  ) {}

  async execute(): Promise<LandingSection[]> {
    return await this.landingSectionRepository.findAll();
  }
}
