-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "levelId" TEXT;

-- CreateIndex
CREATE INDEX "Question_levelId_idx" ON "Question"("levelId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;
