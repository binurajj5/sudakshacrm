/*
  Warnings:

  - You are about to drop the column `title` on the `activities` table. All the data in the column will be lost.
  - Added the required column `subject` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" DROP COLUMN "title",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "subject" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
