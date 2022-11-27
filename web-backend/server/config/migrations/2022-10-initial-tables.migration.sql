CREATE TABLE `the_wall`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NULL,
  `last_name` VARCHAR(100) NULL,
  `email_address` VARCHAR(255) NULL,
  `password` TEXT NULL,
  `status` INT NULL DEFAULT 1,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `index_users_on_email_address` (`email_address` ASC) VISIBLE);


CREATE TABLE `the_wall`.`posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `content` TEXT NULL,
  `created_at` VARCHAR(45) NULL,
  `updated_at` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `indx_users_on_post` (`user_id` ASC) VISIBLE);


CREATE TABLE `the_wall`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `content` TEXT NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `indx_post_on_comments` (`post_id` ASC) VISIBLE,
  INDEX `indx_user_on_comments` (`user_id` ASC) VISIBLE,
  INDEX `indx_post_user_on_comments` (`post_id` ASC, `user_id` ASC) VISIBLE);
