-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentLocation" TEXT,
ADD COLUMN     "travelInterests" TEXT[],
ADD COLUMN     "visitedCountries" TEXT[];
