-- AlterTable
ALTER TABLE "users" ADD COLUMN     "citizen_id" VARCHAR(50);

-- CreateTable
CREATE TABLE "user_line" (
    "id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_line_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_line" ADD CONSTRAINT "user_line_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
