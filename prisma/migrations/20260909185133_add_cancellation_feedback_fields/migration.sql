-- AlterTable
ALTER TABLE "User" ADD COLUMN "cancellationDate" DATETIME;
ALTER TABLE "User" ADD COLUMN "cancellationFeedback" TEXT;
ALTER TABLE "User" ADD COLUMN "cancellationReason" TEXT;
