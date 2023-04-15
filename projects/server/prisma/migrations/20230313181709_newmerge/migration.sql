/*
  Warnings:

  - You are about to drop the column `coordinate` on the `useraddress` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `useraddress` table. All the data in the column will be lost.
  - You are about to drop the column `coordinate` on the `warehouse` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `useraddress` DROP COLUMN `coordinate`,
    DROP COLUMN `district`,
    ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(255) NOT NULL,
    ADD COLUMN `street` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `coordinate`,
    ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL;
