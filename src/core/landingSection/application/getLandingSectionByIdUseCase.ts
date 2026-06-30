import { LandingSectionRepository } from "../domain/landingSectionsRepository";
import { NotFoundError } from "../../shared/Errors/typeErrors";

export class GetLandingSectionByIdUseCase {
  constructor(
    private readonly landingSectionRepository: LandingSectionRepository,
  ) {}

  async execute(id: string) {
    const section = await this.landingSectionRepository.findById(id);
    if (!section) {
      throw new NotFoundError(`Section con ID ${id} no encontrado`);
    }
    return section;
  }
}
