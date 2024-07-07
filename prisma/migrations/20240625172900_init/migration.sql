-- CreateEnum
CREATE TYPE "record_status" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "hash_password" VARCHAR(255) NOT NULL,
    "status" "record_status" NOT NULL DEFAULT 'ACTIVE',
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
