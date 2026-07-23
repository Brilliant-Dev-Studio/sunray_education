-- AlterTable
ALTER TABLE "CertificateRequest" ADD COLUMN "verificationCode" TEXT,
ADD COLUMN "issuedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateRequest_verificationCode_key" ON "CertificateRequest"("verificationCode");

-- CreateIndex
CREATE INDEX "CertificateRequest_verificationCode_idx" ON "CertificateRequest"("verificationCode");
