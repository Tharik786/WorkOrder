CREATE DATABASE IF NOT EXISTS zan_workorder;
CREATE USER IF NOT EXISTS 'tharik'@'%' IDENTIFIED BY 'Tharik@123';
GRANT ALL PRIVILEGES ON zan_workorder.* TO 'tharik'@'%';
FLUSH PRIVILEGES;
USE zan_workorder;

CREATE TABLE IF NOT EXISTS workorder (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    clientName VARCHAR(200),
    buildingName VARCHAR(100),
    floorName VARCHAR(100),
    areaName VARCHAR(100),
    deviceName VARCHAR(200),
    deviceType VARCHAR(100),
    deviceMacId VARCHAR(50),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    assignedTo VARCHAR(100),
    createdBy VARCHAR(100),
    createdTime DATETIME,
    lastReportedTime DATETIME,
    createdAt DATETIME,
    updatedAt DATETIME,
    completedAt DATETIME
);
