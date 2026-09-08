-- AlterTable
ALTER TABLE "Application" ADD COLUMN "followUpDate" DATETIME;

-- CreateIndex
CREATE INDEX "Application_userId_followUpDate_idx" ON "Application"("userId", "followUpDate");
