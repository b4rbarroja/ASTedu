/*
  Warnings:

  - The primary key for the `Subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subject` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subject_title_key";

-- AlterTable
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Subject_pkey" PRIMARY KEY ("title");

-- CreateTable
CREATE TABLE "Summary" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "subjectTitle" TEXT NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_subjectTitle_fkey" FOREIGN KEY ("subjectTitle") REFERENCES "Subject"("title") ON DELETE CASCADE ON UPDATE CASCADE;
