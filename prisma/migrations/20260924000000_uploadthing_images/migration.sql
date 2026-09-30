UPDATE `Customer` SET `tier` = 'Bronze' WHERE `tier` IS NULL OR `tier` = '';
ALTER TABLE `Customer` MODIFY `tier` VARCHAR(191) NOT NULL DEFAULT 'Bronze';

ALTER TABLE `RepairEvidence` ADD COLUMN `imageUploadKey` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `RepairEvidence_imageUploadKey_key` ON `RepairEvidence`(`imageUploadKey`);

CREATE TABLE `ImageDeletionJob` (
  `key` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `lastError` TEXT NULL,
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
