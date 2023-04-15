/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `setPasswordCode` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_setPasswordCode_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    DROP COLUMN `setPasswordCode`;

-- CreateTable
CREATE TABLE `UserName` (
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCode` (
    `userId` INTEGER NOT NULL,
    `setPasswordCode` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserCode_setPasswordCode_key`(`setPasswordCode`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserName` ADD CONSTRAINT `UserName_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCode` ADD CONSTRAINT `UserCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
