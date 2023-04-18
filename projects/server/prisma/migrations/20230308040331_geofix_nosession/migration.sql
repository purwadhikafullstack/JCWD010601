/*
  Warnings:

  - You are about to drop the column `latitude` on the `useraddress` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `useraddress` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coordinate` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- AlterTable
ALTER TABLE `useraddress` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`;

-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `latitude`,
    DROP COLUMN `longitude`,
    ADD COLUMN `coordinate` POINT NOT NULL;

-- DropTable
DROP TABLE `session`;
