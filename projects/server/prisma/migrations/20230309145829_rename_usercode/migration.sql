/*
  Warnings:

  - You are about to drop the column `setPasswordCode` on the `usercode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `UserCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `UserCode_setPasswordCode_key` ON `usercode`;

-- AlterTable
ALTER TABLE `usercode` DROP COLUMN `setPasswordCode`,
    ADD COLUMN `code` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserCode_code_key` ON `UserCode`(`code`);
