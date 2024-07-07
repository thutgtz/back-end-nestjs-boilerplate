-- CreateTable
CREATE TABLE "user_permissions" (
    "user_id" VARCHAR(50) NOT NULL,
    "permission" VARCHAR(50) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("user_id","permission")
);
