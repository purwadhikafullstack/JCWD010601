/*
  Warnings:

  - Added the required column `shipmentPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `shipmentPrice` INTEGER NOT NULL;
