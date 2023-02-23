/*
  Warnings:

  - You are about to drop the column `license` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `discordPoints` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropIndex
DROP INDEX `users_license_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `license`,
    ADD COLUMN `licenseId` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `steamId` VARCHAR(191) NOT NULL DEFAULT '0',
    MODIFY `discordPoints` INTEGER NOT NULL DEFAULT 0;
