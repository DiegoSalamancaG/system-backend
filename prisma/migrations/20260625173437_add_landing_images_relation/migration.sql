-- CreateTable
CREATE TABLE "landing_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "category" "gallery_category" NOT NULL,
    "landing_section_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "landing_images" ADD CONSTRAINT "landing_images_landing_section_id_fkey" FOREIGN KEY ("landing_section_id") REFERENCES "landing_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
