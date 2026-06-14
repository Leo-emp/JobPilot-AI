-- CreateIndex
CREATE INDEX "User_stripeSubId_idx" ON "User"("stripeSubId");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
