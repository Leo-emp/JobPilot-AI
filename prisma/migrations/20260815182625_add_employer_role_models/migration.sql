-- CreateTable
CREATE TABLE "Employer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" TEXT,
    "size" TEXT,
    "website" TEXT,
    "description" TEXT,
    "location" TEXT,
    "remoteFriendly" BOOLEAN NOT NULL DEFAULT false,
    "logoUrl" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "verifiedAt" DATETIME,
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmployerMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'recruiter',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmployerMember_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmployerMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "skills" TEXT,
    "niceToHaveSkills" TEXT,
    "experienceMin" INTEGER,
    "experienceMax" INTEGER,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
    "locationType" TEXT NOT NULL DEFAULT 'remote',
    "location" TEXT,
    "employmentType" TEXT NOT NULL DEFAULT 'full-time',
    "industry" TEXT,
    "education" TEXT,
    "urgency" TEXT NOT NULL DEFAULT 'normal',
    "candidatesNeeded" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" DATETIME,
    "filledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Role_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "Employer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CandidatePreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "openToWork" BOOLEAN NOT NULL DEFAULT true,
    "desiredTitle" TEXT,
    "desiredSkills" TEXT,
    "locationPref" TEXT NOT NULL DEFAULT 'remote',
    "locations" TEXT,
    "salaryMin" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
    "employmentType" TEXT NOT NULL DEFAULT 'full-time',
    "industries" TEXT,
    "companySizes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CandidatePreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Employer_slug_key" ON "Employer"("slug");

-- CreateIndex
CREATE INDEX "Employer_deletedAt_idx" ON "Employer"("deletedAt");

-- CreateIndex
CREATE INDEX "Employer_verifiedAt_idx" ON "Employer"("verifiedAt");

-- CreateIndex
CREATE INDEX "EmployerMember_userId_idx" ON "EmployerMember"("userId");

-- CreateIndex
CREATE INDEX "EmployerMember_employerId_role_idx" ON "EmployerMember"("employerId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerMember_employerId_userId_key" ON "EmployerMember"("employerId", "userId");

-- CreateIndex
CREATE INDEX "Role_employerId_idx" ON "Role"("employerId");

-- CreateIndex
CREATE INDEX "Role_status_idx" ON "Role"("status");

-- CreateIndex
CREATE INDEX "Role_publishedAt_idx" ON "Role"("publishedAt");

-- CreateIndex
CREATE INDEX "Role_status_publishedAt_idx" ON "Role"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CandidatePreference_userId_key" ON "CandidatePreference"("userId");
