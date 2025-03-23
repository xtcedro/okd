-- ========================================================
--  OKDevs Appointment Database
--  Created: 2025-03-22 | Version: 1.3
-- ========================================================

CREATE DATABASE IF NOT EXISTS okdevs_appointments;
USE okdevs_appointments;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_appointment (email, service, created_at),
    INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
--  Heavenly Roofing Appointment Database
--  Created: 2025-03-22 | Version: 1.3
-- ========================================================

CREATE DATABASE IF NOT EXISTS heavenlyroofing_appointments;
USE heavenlyroofing_appointments;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_appointment (email, service, created_at),
    INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
--  Dominguez Tech Solutions Appointment Database
--  Created: 2025-03-22 | Version: 1.3
-- ========================================================

CREATE DATABASE IF NOT EXISTS domtech_appointments;
USE domtech_appointments;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_appointment (email, service, created_at),
    INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Create User & Grant Privileges (Created: 2025-03-22)
-- ========================================================

-- Create the user (if not already exists)
CREATE USER IF NOT EXISTS 'webadmin'@'localhost' IDENTIFIED BY 'Password123!';

-- Grant ALL privileges to this user on each database
GRANT ALL PRIVILEGES ON okdevs_appointments.* TO 'webadmin'@'localhost';
GRANT ALL PRIVILEGES ON heavenlyroofing_appointments.* TO 'webadmin'@'localhost';
GRANT ALL PRIVILEGES ON domtech_appointments.* TO 'webadmin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;