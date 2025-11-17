/*
  Warnings:

  - You are about to drop the column `difficulty` on the `PracticeResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PracticeResult" DROP COLUMN "difficulty";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
