-- CreateTable
CREATE TABLE "Outreach" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleId" TEXT NOT NULL,
    "externalCandidateId" TEXT,
    "candidateMatchId" TEXT,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "followUpNumber" INTEGER NOT NULL DEFAULT 0,
    "sentAt" DATETIME,
    "openedAt" DATETIME,
    "repliedAt" DATETIME,
    "bouncedAt" DATETIME,
    "replyClassification" TEXT,
    "inviteToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmailSuppression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roleId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Shortlist',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "deliveredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Shortlist_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShortlistEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortlistId" TEXT NOT NULL,
    "candidateMatchId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "employerNote" TEXT,
    CONSTRAINT "ShortlistEntry_shortlistId_fkey" FOREIGN KEY ("shortlistId") REFERENCES "Shortlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Outreach_inviteToken_key" ON "Outreach"("inviteToken");

-- CreateIndex
CREATE INDEX "Outreach_roleId_idx" ON "Outreach"("roleId");

-- CreateIndex
CREATE INDEX "Outreach_externalCandidateId_idx" ON "Outreach"("externalCandidateId");

-- CreateIndex
CREATE INDEX "Outreach_status_idx" ON "Outreach"("status");

-- CreateIndex
CREATE INDEX "Outreach_roleId_status_idx" ON "Outreach"("roleId", "status");

-- CreateIndex
CREATE INDEX "Outreach_email_idx" ON "Outreach"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSuppression_email_key" ON "EmailSuppression"("email");

-- CreateIndex
CREATE INDEX "EmailSuppression_email_idx" ON "EmailSuppression"("email");

-- CreateIndex
CREATE INDEX "Shortlist_roleId_idx" ON "Shortlist"("roleId");

-- CreateIndex
CREATE INDEX "Shortlist_employerId_idx" ON "Shortlist"("employerId");

-- CreateIndex
CREATE INDEX "ShortlistEntry_shortlistId_position_idx" ON "ShortlistEntry"("shortlistId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ShortlistEntry_shortlistId_candidateMatchId_key" ON "ShortlistEntry"("shortlistId", "candidateMatchId");
