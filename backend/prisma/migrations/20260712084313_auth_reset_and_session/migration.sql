-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "password_reset_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "password_reset_token_hash" TEXT,
ADD COLUMN     "token_version" INTEGER NOT NULL DEFAULT 0;
