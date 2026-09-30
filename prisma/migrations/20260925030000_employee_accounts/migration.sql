ALTER TABLE `Employee` ADD COLUMN `email` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Employee_email_key` ON `Employee`(`email`);

ALTER TABLE `UserAccount`
  MODIFY COLUMN `role` ENUM('ADMIN', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER',
  ADD COLUMN `employeeId` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `UserAccount_employeeId_key` ON `UserAccount`(`employeeId`);
ALTER TABLE `UserAccount` ADD CONSTRAINT `UserAccount_employeeId_fkey`
  FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
