-- CreateTable
CREATE TABLE "VolunteerTeacher" (
    "id" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "courseTaught" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "verificationCode" TEXT,
    "issuedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VolunteerTeacher_verificationCode_key" ON "VolunteerTeacher"("verificationCode");

-- CreateIndex
CREATE INDEX "VolunteerTeacher_verificationCode_idx" ON "VolunteerTeacher"("verificationCode");
