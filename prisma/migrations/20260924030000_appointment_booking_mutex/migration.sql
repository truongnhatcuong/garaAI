CREATE TABLE `AppointmentBookingMutex` (
    `id` INTEGER NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `AppointmentBookingMutex` (`id`, `version`) VALUES (1, 0);
