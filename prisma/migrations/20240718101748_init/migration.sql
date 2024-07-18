/*
  Warnings:

  - Added the required column `line_id` to the `user_line` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_line" ADD COLUMN     "line_id" VARCHAR(50) NOT NULL;
