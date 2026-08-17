-- CreateTable
CREATE TABLE "ExternalCandidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "profileUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "skills" TEXT,
    "experience" TEXT,
    "rawData" TEXT,
    "convertedUserId" TEXT,
    "inviteToken" TEXT,
    "inviteExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CandidateMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT,
    "externalId" TEXT,
    "roleId" TEXT NOT NULL,
    "prefId" TEXT,
    "score" INTEGER NOT NULL,
    "breakdown" TEXT NOT NULL,
    "matchedSkills" TEXT,
    "missingSkills" TEXT,
    "source" TEXT NOT NULL DEFAULT 'internal',
    "status" TEXT NOT NULL DEFAULT 'new',
    "feedback" TEXT,
    "feedbackNote" TEXT,
    "candidateVisible" BOOLEAN NOT NULL DEFAULT true,
    "candidateHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CandidateMatch_prefId_fkey" FOREIGN KEY ("prefId") REFERENCES "CandidatePreference" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateMatch_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateMatch_externalId_fkey" FOREIGN KEY ("externalId") REFERENCES "ExternalCandidate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CandidateMatch" ("breakdown", "candidateHidden", "candidateId", "candidateVisible", "createdAt", "feedback", "feedbackNote", "id", "matchedSkills", "missingSkills", "prefId", "roleId", "score", "status", "updatedAt") SELECT "breakdown", "candidateHidden", "candidateId", "candidateVisible", "createdAt", "feedback", "feedbackNote", "id", "matchedSkills", "missingSkills", "prefId", "roleId", "score", "status", "updatedAt" FROM "CandidateMatch";
DROP TABLE "CandidateMatch";
ALTER TABLE "new_CandidateMatch" RENAME TO "CandidateMatch";
CREATE INDEX "CandidateMatch_roleId_score_idx" ON "CandidateMatch"("roleId", "score");
CREATE INDEX "CandidateMatch_candidateId_status_idx" ON "CandidateMatch"("candidateId", "status");
CREATE INDEX "CandidateMatch_roleId_status_idx" ON "CandidateMatch"("roleId", "status");
CREATE INDEX "CandidateMatch_feedback_idx" ON "CandidateMatch"("feedback");
CREATE INDEX "CandidateMatch_externalId_idx" ON "CandidateMatch"("externalId");
CREATE UNIQUE INDEX "CandidateMatch_candidateId_roleId_key" ON "CandidateMatch"("candidateId", "roleId");
CREATE UNIQUE INDEX "CandidateMatch_roleId_externalId_key" ON "CandidateMatch"("roleId", "externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCandidate_convertedUserId_key" ON "ExternalCandidate"("convertedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCandidate_inviteToken_key" ON "ExternalCandidate"("inviteToken");

-- CreateIndex
CREATE INDEX "ExternalCandidate_email_idx" ON "ExternalCandidate"("email");

-- CreateIndex
CREATE INDEX "ExternalCandidate_convertedUserId_idx" ON "ExternalCandidate"("convertedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCandidate_source_profileUrl_key" ON "ExternalCandidate"("source", "profileUrl");
