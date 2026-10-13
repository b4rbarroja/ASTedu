/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `filesLinks` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `Subject` table. All the data in the column will be lost.
  - Added the required column `prof` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "createdAt",
DROP COLUMN "filesLinks",
DROP COLUMN "publisher",
ADD COLUMN     "prof" TEXT NOT NULL;
