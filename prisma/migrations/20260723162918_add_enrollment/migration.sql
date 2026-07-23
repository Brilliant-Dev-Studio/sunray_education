-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "courseTitle" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "verificationCode" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_verificationCode_key" ON "Enrollment"("verificationCode");

-- CreateIndex
CREATE INDEX "Enrollment_verificationCode_idx" ON "Enrollment"("verificationCode");
