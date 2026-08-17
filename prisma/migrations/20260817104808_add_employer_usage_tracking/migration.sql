-- CreateTable
CREATE TABLE "EmployerUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "rolesPosted" INTEGER NOT NULL DEFAULT 0,
    "candidatesContacted" INTEGER NOT NULL DEFAULT 0,
    "matchesViewed" INTEGER NOT NULL DEFAULT 0,
    "bookmarksUsed" INTEGER NOT NULL DEFAULT 0,
    "shortlistsDelivered" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "EmployerUsage_employerId_idx" ON "EmployerUsage"("employerId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerUsage_employerId_month_key" ON "EmployerUsage"("employerId", "month");
