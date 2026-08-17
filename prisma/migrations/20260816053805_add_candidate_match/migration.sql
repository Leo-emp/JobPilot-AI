-- CreateTable
CREATE TABLE "CandidateMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidateId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "prefId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "breakdown" TEXT NOT NULL,
    "matchedSkills" TEXT,
    "missingSkills" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "feedback" TEXT,
    "feedbackNote" TEXT,
    "candidateVisible" BOOLEAN NOT NULL DEFAULT true,
    "candidateHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CandidateMatch_prefId_fkey" FOREIGN KEY ("prefId") REFERENCES "CandidatePreference" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateMatch_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CandidateMatch_roleId_score_idx" ON "CandidateMatch"("roleId", "score");

-- CreateIndex
CREATE INDEX "CandidateMatch_candidateId_status_idx" ON "CandidateMatch"("candidateId", "status");

-- CreateIndex
CREATE INDEX "CandidateMatch_roleId_status_idx" ON "CandidateMatch"("roleId", "status");

-- CreateIndex
CREATE INDEX "CandidateMatch_feedback_idx" ON "CandidateMatch"("feedback");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateMatch_candidateId_roleId_key" ON "CandidateMatch"("candidateId", "roleId");
