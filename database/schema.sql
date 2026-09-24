CREATE DATABASE IF NOT EXISTS zan_workorder;
CREATE USER IF NOT EXISTS 'workorder'@'%' IDENTIFIED BY 'change_me';
GRANT ALL PRIVILEGES ON zan_workorder.* TO 'workorder'@'%';
FLUSH PRIVILEGES;
USE zan_workorder;
