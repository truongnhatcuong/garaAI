UPDATE `UserAccount` AS account
JOIN `Customer` AS customer ON customer.id = account.customerId
SET account.name = customer.name
WHERE account.name IS NULL;

UPDATE `UserAccount`
SET `name` = 'Quản trị viên'
WHERE `role` = 'ADMIN' AND (`name` IS NULL OR TRIM(`name`) = '');
