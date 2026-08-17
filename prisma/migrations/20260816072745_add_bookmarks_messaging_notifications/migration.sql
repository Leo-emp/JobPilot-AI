-- CreateTable
CREATE TABLE "EmployerBookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "roleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployerBookmark_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmployerBookmark_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CandidateBookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "employerId" TEXT,
    "roleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "roleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "blockedById" TEXT,
    "lastMessageAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageThread_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MessageThread_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "linkUrl" TEXT,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
INSERT INTO "new_User" ("aiUsageCount", "createdAt", "defaultResumeId", "deletedAt", "email", "goal", "id", "image", "name", "password", "plan", "referralSource", "stripeCustomerId", "stripeSubId", "topSkills", "twoFactorEnabled", "twoFactorSecret", "updatedAt", "usageResetDate", "weeklyDigest") SELECT "aiUsageCount", "createdAt", "defaultResumeId", "deletedAt", "email", "goal", "id", "image", "name", "password", "plan", "referralSource", "stripeCustomerId", "stripeSubId", "topSkills", "twoFactorEnabled", "twoFactorSecret", "updatedAt", "usageResetDate", "weeklyDigest" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_stripeSubId_idx" ON "User"("stripeSubId");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "EmployerBookmark_candidateId_idx" ON "EmployerBookmark"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerBookmark_employerId_candidateId_key" ON "EmployerBookmark"("employerId", "candidateId");

-- CreateIndex
CREATE INDEX "CandidateBookmark_employerId_idx" ON "CandidateBookmark"("employerId");

-- CreateIndex
CREATE INDEX "CandidateBookmark_roleId_idx" ON "CandidateBookmark"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateBookmark_userId_employerId_key" ON "CandidateBookmark"("userId", "employerId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateBookmark_userId_roleId_key" ON "CandidateBookmark"("userId", "roleId");

-- CreateIndex
CREATE INDEX "MessageThread_candidateId_lastMessageAt_idx" ON "MessageThread"("candidateId", "lastMessageAt");

-- CreateIndex
CREATE INDEX "MessageThread_employerId_lastMessageAt_idx" ON "MessageThread"("employerId", "lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageThread_candidateId_employerId_roleId_key" ON "MessageThread"("candidateId", "employerId", "roleId");

-- CreateIndex
CREATE INDEX "Message_threadId_createdAt_idx" ON "Message"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");
