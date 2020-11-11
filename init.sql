CREATE DATABASE IF NOT EXISTS `PXL-IOT`;

USE `PXL-IOT`

CREATE TABLE `SensorData` (
  `ID` varchar(255) NOT NULL,
  `Value` float NOT NULL,
  `Timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `SensorOverview` (
  `ID` varchar(255) DEFAULT NULL,
  `Brand` varchar(255) DEFAULT NULL,
  `IP` varchar(255) DEFAULT NULL,
  `Value` double NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
