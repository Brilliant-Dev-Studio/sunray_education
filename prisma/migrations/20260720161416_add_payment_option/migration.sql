-- CreateTable
CREATE TABLE "PaymentOption" (
    "id" TEXT NOT NULL,
    "code" "PaymentMethod" NOT NULL,
    "label" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "qrUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOption_code_key" ON "PaymentOption"("code");
