-- CreateTable
CREATE TABLE "AiResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AiResult_userId_action_idx" ON "AiResult"("userId", "action");

-- CreateIndex
CREATE INDEX "AiResult_userId_createdAt_idx" ON "AiResult"("userId", "createdAt");
