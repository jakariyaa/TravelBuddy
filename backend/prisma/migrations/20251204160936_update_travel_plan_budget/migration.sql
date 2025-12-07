/*
  Warnings:

  - Added the required column `budgetRange` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `budget` on the `TravelPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TravelPlan" ADD COLUMN     "budgetRange" TEXT NOT NULL,
DROP COLUMN "budget",
ADD COLUMN     "budget" INTEGER NOT NULL;
