/*
  Warnings:

  - Added the required column `contactEmail` to the `CertificateRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CertificateRequest" ADD COLUMN     "contactEmail" TEXT NOT NULL;
