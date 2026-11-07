-- CreateEnum
CREATE TYPE "InviteType" AS ENUM ('INVITE', 'RESET');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'INVITE';
ALTER TYPE "AuditAction" ADD VALUE 'REVOKE_INVITE';
ALTER TYPE "AuditAction" ADD VALUE 'ACCEPT_INVITE';
ALTER TYPE "AuditAction" ADD VALUE 'RESET_LINK';
ALTER TYPE "AuditAction" ADD VALUE 'PASSWORD_RESET';

-- CreateTable
CREATE TABLE "AdminInvite" (
    "id" TEXT NOT NULL,
    "type" "InviteType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "adminId" TEXT,
    "createdById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminInvite_tokenHash_key" ON "AdminInvite"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminInvite_email_idx" ON "AdminInvite"("email");

-- AddForeignKey
ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
