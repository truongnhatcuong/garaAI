CREATE TABLE `InvoiceSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `taxPercent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `InvoiceSettings` (`id`, `taxPercent`) VALUES (1, 0);

ALTER TABLE `Invoice` ADD COLUMN `taxPercent` DECIMAL(5, 2) NULL;
