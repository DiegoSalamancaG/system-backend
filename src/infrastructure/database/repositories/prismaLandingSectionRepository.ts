import { LandingSection } from "../../../core/landingSection/domain/landingSections";
import {
  LandingSectionRepository,
  CreateLandingSectionInput,
  UpdateLandingSectionInput,
} from "../../../core/landingSection/domain/landingSectionsRepository";
import { prisma } from "../../../context/prisma";

export class PrismaLandingSectionRepository implements LandingSectionRepository {
  async create(section: CreateLandingSectionInput): Promise<LandingSection> {
    const { key, title, content, createdBy, uploadedImages } = section;
    const created = await prisma.landingSection.create({
      data: {
        key: key!,
        title: title!,
        content: content!,
        createdBy: createdBy,
        images:
          uploadedImages && uploadedImages.length > 0
            ? {
                create: uploadedImages.map((img: any) => ({
                  url: img.url,
                  category: img.category,
                  altText: img.altText || undefined,
                })),
              }
            : undefined,
      },
      include: { images: true },
    });

    return created;
  }

  async findByKey(key: string): Promise<LandingSection | null> {
    return await prisma.landingSection.findUnique({
      include: { images: true },
      where: { key },
    });
  }

  async findById(id: string): Promise<LandingSection | null> {
    return await prisma.landingSection.findUnique({
      include: { images: true },
      where: { id },
    });
  }

  async findAll(): Promise<LandingSection[]> {
    return await prisma.landingSection.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
  }

  async update(
    id: string,
    sectionData: UpdateLandingSectionInput,
  ): Promise<LandingSection> {
    const imagesToReplace = sectionData.uploadedImages ?? sectionData.images;

    return await prisma.landingSection.update({
      where: { id },
      data: {
        title: sectionData.title,
        content: sectionData.content,
        key: sectionData.key,
        updatedBy: sectionData.updatedBy,
        images: imagesToReplace
          ? {
              deleteMany: {}, // Borra las relaciones viejas en cascada en la BD
              create: imagesToReplace.map((img: any) => ({
                url: img.url,
                category: img.category,
                altText: img.altText || null,
              })),
            }
          : undefined,
      },
      include: { images: true },
    });
  }
}
