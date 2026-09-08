-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "password" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "aiUsageCount" INTEGER NOT NULL DEFAULT 0,
    "usageResetDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bonusCalls" INTEGER NOT NULL DEFAULT 0,
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT true,
    "topSkills" TEXT,
    "goal" TEXT,
    "referralSource" TEXT,
    "defaultResumeId" TEXT,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_User" ("aiUsageCount", "createdAt", "defaultResumeId", "deletedAt", "email", "emailNotifications", "goal", "id", "image", "name", "password", "plan", "referralSource", "stripeCustomerId", "stripeSubId", "topSkills", "twoFactorEnabled", "twoFactorSecret", "updatedAt", "usageResetDate", "weeklyDigest") SELECT "aiUsageCount", "createdAt", "defaultResumeId", "deletedAt", "email", "emailNotifications", "goal", "id", "image", "name", "password", "plan", "referralSource", "stripeCustomerId", "stripeSubId", "topSkills", "twoFactorEnabled", "twoFactorSecret", "updatedAt", "usageResetDate", "weeklyDigest" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_stripeSubId_idx" ON "User"("stripeSubId");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
