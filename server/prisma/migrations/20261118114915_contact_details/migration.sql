-- AlterEnum
ALTER TYPE "AuditEntity" ADD VALUE 'ContactDetails';

-- CreateTable
CREATE TABLE "ContactDetails" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "address" TEXT[],
    "hours" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("id")
);
