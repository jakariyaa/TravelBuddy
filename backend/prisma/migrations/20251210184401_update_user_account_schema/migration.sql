-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "idToken" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "emailVerified" DROP NOT NULL;
