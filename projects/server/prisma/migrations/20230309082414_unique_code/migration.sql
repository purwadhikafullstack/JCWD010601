/*
  Warnings:

  - A unique constraint covering the columns `[setPasswordCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_setPasswordCode_key` ON `User`(`setPasswordCode`);
