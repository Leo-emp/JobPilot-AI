-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CandidateBookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "employerId" TEXT,
    "roleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CandidateBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateBookmark_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CandidateBookmark_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CandidateBookmark" ("createdAt", "employerId", "id", "roleId", "userId") SELECT "createdAt", "employerId", "id", "roleId", "userId" FROM "CandidateBookmark";
DROP TABLE "CandidateBookmark";
ALTER TABLE "new_CandidateBookmark" RENAME TO "CandidateBookmark";
CREATE INDEX "CandidateBookmark_employerId_idx" ON "CandidateBookmark"("employerId");
CREATE INDEX "CandidateBookmark_roleId_idx" ON "CandidateBookmark"("roleId");
CREATE UNIQUE INDEX "CandidateBookmark_userId_employerId_key" ON "CandidateBookmark"("userId", "employerId");
CREATE UNIQUE INDEX "CandidateBookmark_userId_roleId_key" ON "CandidateBookmark"("userId", "roleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
