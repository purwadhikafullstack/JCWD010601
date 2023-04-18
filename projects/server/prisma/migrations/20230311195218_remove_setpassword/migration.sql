/*
  Warnings:

  - You are about to drop the `usercode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `usercode` DROP FOREIGN KEY `UserCode_userId_fkey`;

-- DropTable
DROP TABLE `usercode`;
