/*
  Warnings:

  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - Added the required column `textTranslationId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LANGUAGES" AS ENUM ('EN', 'FR');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
ADD COLUMN     "textTranslationId" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TextTranslation" (
    "id" SERIAL NOT NULL,
    "language" "LANGUAGES" NOT NULL,
    "text" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TextTranslation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_textTranslationId_fkey" FOREIGN KEY ("textTranslationId") REFERENCES "TextTranslation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
