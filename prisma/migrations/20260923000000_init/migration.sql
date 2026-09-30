-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tier` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_phone_key`(`phone`),
    UNIQUE INDEX `Customer_email_key`(`email`),
    INDEX `Customer_name_idx`(`name`),
    INDEX `Customer_deletedAt_createdAt_idx`(`deletedAt`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` VARCHAR(191) NOT NULL,
    `plate` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `vin` VARCHAR(191) NULL,
    `odometerKm` INTEGER NULL,
    `warranty` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'IN_REPAIR', 'READY') NOT NULL DEFAULT 'ACTIVE',
    `customerId` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_plate_key`(`plate`),
    UNIQUE INDEX `Vehicle_vin_key`(`vin`),
    INDEX `Vehicle_customerId_deletedAt_idx`(`customerId`, `deletedAt`),
    INDEX `Vehicle_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `durationMinutes` INTEGER NOT NULL,
    `price` DECIMAL(14, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Service_code_key`(`code`),
    INDEX `Service_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `shiftStart` VARCHAR(191) NULL,
    `shiftEnd` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_code_key`(`code`),
    INDEX `Employee_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'ARRIVED', 'IN_PROGRESS', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Appointment_code_key`(`code`),
    INDEX `Appointment_startsAt_status_idx`(`startsAt`, `status`),
    INDEX `Appointment_customerId_deletedAt_idx`(`customerId`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Part` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `cost` DECIMAL(14, 2) NOT NULL,
    `price` DECIMAL(14, 2) NOT NULL,
    `stockQty` INTEGER NOT NULL DEFAULT 0,
    `minStock` INTEGER NOT NULL DEFAULT 0,
    `unit` VARCHAR(191) NOT NULL DEFAULT 'cái',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Part_sku_key`(`sku`),
    INDEX `Part_name_idx`(`name`),
    INDEX `Part_stockQty_idx`(`stockQty`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairOrder` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `appointmentId` VARCHAR(191) NULL,
    `advisorId` VARCHAR(191) NULL,
    `technicianId` VARCHAR(191) NULL,
    `scheduledAt` DATETIME(3) NULL,
    `status` ENUM('INTAKE', 'WAITING_APPROVAL', 'WAITING_PARTS', 'REPAIRING', 'QUALITY_CHECK', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'INTAKE',
    `bayCode` VARCHAR(191) NULL,
    `odometerKm` INTEGER NULL,
    `diagnosis` TEXT NULL,
    `notes` TEXT NULL,
    `estimateTotal` DECIMAL(14, 2) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RepairOrder_code_key`(`code`),
    UNIQUE INDEX `RepairOrder_appointmentId_key`(`appointmentId`),
    INDEX `RepairOrder_status_scheduledAt_idx`(`status`, `scheduledAt`),
    INDEX `RepairOrder_vehicleId_deletedAt_idx`(`vehicleId`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairOrderLine` (
    `id` VARCHAR(191) NOT NULL,
    `repairOrderId` VARCHAR(191) NOT NULL,
    `type` ENUM('PART', 'SERVICE') NOT NULL,
    `partId` VARCHAR(191) NULL,
    `serviceId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(14, 2) NOT NULL,
    `total` DECIMAL(14, 2) NOT NULL,
    `stockNote` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `RepairOrderLine_repairOrderId_sortOrder_idx`(`repairOrderId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairTask` (
    `id` VARCHAR(191) NOT NULL,
    `repairOrderId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `RepairTask_repairOrderId_sortOrder_idx`(`repairOrderId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RepairEvidence` (
    `id` VARCHAR(191) NOT NULL,
    `repairOrderId` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `caption` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `RepairEvidence_repairOrderId_sortOrder_idx`(`repairOrderId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NULL,
    `repairOrderId` VARCHAR(191) NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subtotal` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `tax` DECIMAL(14, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(14, 2) NOT NULL,
    `status` ENUM('DRAFT', 'PENDING_APPROVAL', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_code_key`(`code`),
    INDEX `Invoice_issuedAt_status_idx`(`issuedAt`, `status`),
    INDEX `Invoice_customerId_deletedAt_idx`(`customerId`, `deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(14, 2) NOT NULL,
    `method` ENUM('CASH', 'BANK_TRANSFER', 'CARD', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paidAt` DATETIME(3) NULL,
    `notes` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_code_key`(`code`),
    INDEX `Payment_invoiceId_status_idx`(`invoiceId`, `status`),
    INDEX `Payment_paidAt_idx`(`paidAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NULL,
    `type` ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS') NOT NULL DEFAULT 'INFO',
    `employeeId` VARCHAR(191) NULL,
    `readAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_employeeId_readAt_idx`(`employeeId`, `readAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkshopBay` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NULL,
    `statusText` VARCHAR(191) NULL,
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WorkshopBay_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Report` (
    `id` VARCHAR(191) NOT NULL,
    `periodStart` DATETIME(3) NOT NULL,
    `revenue` DECIMAL(14, 2) NOT NULL,
    `cost` DECIMAL(14, 2) NOT NULL,
    `profit` DECIMAL(14, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `deletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Report_periodStart_key`(`periodStart`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAccount` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    `customerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserAccount_email_key`(`email`),
    UNIQUE INDEX `UserAccount_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Session_tokenHash_key`(`tokenHash`),
    INDEX `Session_userId_expiresAt_idx`(`userId`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrder` ADD CONSTRAINT `RepairOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrder` ADD CONSTRAINT `RepairOrder_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrder` ADD CONSTRAINT `RepairOrder_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrder` ADD CONSTRAINT `RepairOrder_advisorId_fkey` FOREIGN KEY (`advisorId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrder` ADD CONSTRAINT `RepairOrder_technicianId_fkey` FOREIGN KEY (`technicianId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrderLine` ADD CONSTRAINT `RepairOrderLine_repairOrderId_fkey` FOREIGN KEY (`repairOrderId`) REFERENCES `RepairOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrderLine` ADD CONSTRAINT `RepairOrderLine_partId_fkey` FOREIGN KEY (`partId`) REFERENCES `Part`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairOrderLine` ADD CONSTRAINT `RepairOrderLine_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairTask` ADD CONSTRAINT `RepairTask_repairOrderId_fkey` FOREIGN KEY (`repairOrderId`) REFERENCES `RepairOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RepairEvidence` ADD CONSTRAINT `RepairEvidence_repairOrderId_fkey` FOREIGN KEY (`repairOrderId`) REFERENCES `RepairOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_repairOrderId_fkey` FOREIGN KEY (`repairOrderId`) REFERENCES `RepairOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkshopBay` ADD CONSTRAINT `WorkshopBay_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkshopBay` ADD CONSTRAINT `WorkshopBay_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAccount` ADD CONSTRAINT `UserAccount_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `UserAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
