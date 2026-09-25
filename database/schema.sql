CREATE DATABASE IF NOT EXISTS configpage;
CREATE USER IF NOT EXISTS 'zanprduser'@'%' IDENTIFIED BY 'Insp!ron154';
GRANT ALL PRIVILEGES ON configpage.* TO 'zanprduser'@'%';
FLUSH PRIVILEGES;
USE configpage;

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
