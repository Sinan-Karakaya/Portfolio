-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_textTranslationId_fkey";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_textTranslationId_fkey" FOREIGN KEY ("textTranslationId") REFERENCES "TextTranslation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
