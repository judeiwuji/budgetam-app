-- Create Database
CREATE DATABASE IF NOT EXISTS `budgetam_db`;

-- Creates Budgetam App User
CREATE USER IF NOT EXISTS 'budgetam_backend_user'@'localhost' IDENTIFIED BY 'helloworld2024';

-- Grant privileges to user
GRANT ALL PRIVILEGES ON budgetam_db.* TO 'budgetam_backend_user'@'localhost';