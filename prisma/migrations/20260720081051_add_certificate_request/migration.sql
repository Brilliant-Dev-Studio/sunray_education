-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UAB_PAY', 'KBZ_PAY', 'WAVE_MONEY');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CertificateRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "levelCode" TEXT NOT NULL,
    "levelName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percentage" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "invoiceImage" TEXT NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CertificateRequest_userId_idx" ON "CertificateRequest"("userId");

-- CreateIndex
CREATE INDEX "CertificateRequest_testId_idx" ON "CertificateRequest"("testId");

-- CreateIndex
CREATE INDEX "CertificateRequest_status_idx" ON "CertificateRequest"("status");

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
