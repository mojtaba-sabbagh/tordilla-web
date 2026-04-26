/*
  Warnings:

  - The `status` column on the `ContactMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ContactMessage" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'UNSEEN';

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");
