CREATE TABLE `MembershipTier` (
    `code` VARCHAR(20) NOT NULL,
    `label` VARCHAR(50) NOT NULL,
    `discountPercent` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `MembershipTier` (`code`, `label`, `discountPercent`) VALUES
    ('Bronze', 'Đồng', 0),
    ('Silver', 'Bạc', 0),
    ('Gold', 'Vàng', 0),
    ('Platinum', 'Bạch kim', 0);

CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL,
    `spentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `Expense_spentAt_deletedAt_idx`(`spentAt`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
