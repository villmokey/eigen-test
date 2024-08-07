/*
  Warnings:

  - Added the required column `penalize_until` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "penalize_until" TIMESTAMP(3) NOT NULL;
