-- ===========================================
-- Pan Logistics Database Schema
-- MySQL Database Setup Script
-- ===========================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS pan_logistics;
USE pan_logistics;

-- ===========================================
-- USERS TABLE
-- Admin and staff user accounts
-- ===========================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- BOOKINGS TABLE
-- Shipment and freight bookings
-- ===========================================
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    sender_name VARCHAR(255) NOT NULL,
    sender_company VARCHAR(255),
    sender_phone VARCHAR(50) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    sender_address TEXT NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(50) NOT NULL,
    receiver_address TEXT NOT NULL,
    receiver_country VARCHAR(100) NOT NULL,
    shipment_type ENUM('Air Freight', 'Sea Freight', 'Land Transport') NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    dimensions VARCHAR(100),
    cargo_type VARCHAR(100) NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_priority ENUM('Standard', 'Express', 'Urgent') NOT NULL,
    status ENUM('Booked', 'Processing', 'In Transit', 'At Warehouse', 'Out for Delivery', 'Delivered') DEFAULT 'Booked',
    estimated_delivery DATE,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tracking (tracking_number),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_sender_email (sender_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- CONTACT_MESSAGES TABLE
-- Customer inquiry messages
-- ===========================================
DROP TABLE IF EXISTS contact_messages;
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
(
    'Admin User',
    'admin@panlogistics.ca',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin'
);

-- Insert sample bookings
INSERT INTO bookings (
    tracking_number, sender_name, sender_company, sender_phone, sender_email,
    sender_address, receiver_name, receiver_phone, receiver_address,
    receiver_country, shipment_type, weight, dimensions, cargo_type,
    pickup_date, delivery_priority, estimated_delivery, status
) VALUES 
(
    'PAN-LX12345-ABC',
    'John Davidson',
    'GlobalTrade Inc.',
    '+1 (416) 555-0123',
    'john@globaltrade.com',
    '123 Business Ave, Toronto, ON M5V 3A8',
    'Sarah Williams',
    '+1 (212) 555-0456',
    '456 Commerce St, New York, NY 10001',
    'United States',
    'Air Freight',
    150.00,
    '50x40x30',
    'General Cargo',
    CURDATE(),
    'Express',
    DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    'In Transit'
),
(
    'PAN-MK98765-XYZ',
    'Robert Brown',
    'RetailMax Ltd.',
    '+1 (416) 555-0789',
    'robert@retailmax.ca',
    '789 Market St, Vancouver, BC V6B 1A1',
    'James Wilson',
    '+44 20 7123 4567',
    '123 High Street, London, UK SW1A 1AA',
    'United Kingdom',
    'Sea Freight',
    2000.00,
    '200x150x200',
    'Container',
    DATE_SUB(CURDATE(), INTERVAL 10 DAY),
    'Standard',
    DATE_ADD(CURDATE(), INTERVAL 15 DAY),
    'Delivered'
),
(
    'PAN-NW45678-DEF',
    'Emily Chen',
    'TechFlow Solutions',
    '+1 (416) 555-0321',
    'emily@techflow.ca',
    '321 Innovation Blvd, Montreal, QC H3A 1A1',
    'Michael Mueller',
    '+49 30 1234 5678',
    'Hauptstrasse 1, Berlin, Germany 10115',
    'Germany',
    'Land Transport',
    500.00,
    '100x80x60',
    'Fragile Items',
    CURDATE(),
    'Urgent',
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    'Booked'
);

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message) VALUES 
(
    'David Smith',
    'david@company.com',
    '+1 (416) 555-0654',
    'Shipping Inquiry',
    'I would like to get a quote for shipping 500 kg of electronics from Toronto to Los Angeles. Please contact me with pricing options.'
),
(
    'Lisa Anderson',
    'lisa@startup.io',
    '+1 (416) 555-0987',
    'Partnership',
    'We are a startup looking for logistics partners. Would like to discuss potential collaboration.'
);

-- ===========================================
-- VIEWS
-- ===========================================

-- View for booking statistics
CREATE OR REPLACE VIEW booking_stats AS
SELECT 
    COUNT(*) as total_bookings,
    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
    SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) as in_transit,
    SUM(CASE WHEN status = 'Booked' THEN 1 ELSE 0 END) as pending,
    SUM(weight) as total_weight
FROM bookings;

-- ===========================================
-- STORED PROCEDURES
-- ===========================================

DELIMITER //

-- Procedure to update booking status
CREATE PROCEDURE update_booking_status(IN p_id INT, IN p_status VARCHAR(50))
BEGIN
    UPDATE bookings SET status = p_status WHERE id = p_id;
END //

-- Procedure to get bookings by status
CREATE PROCEDURE get_bookings_by_status(IN p_status VARCHAR(50))
BEGIN
    SELECT * FROM bookings WHERE status = p_status ORDER BY created_at DESC;
END //

-- Procedure to search bookings
CREATE PROCEDURE search_bookings(IN p_search VARCHAR(255))
BEGIN
    SELECT * FROM bookings 
    WHERE tracking_number LIKE CONCAT('%', p_search, '%')
       OR sender_name LIKE CONCAT('%', p_search, '%')
       OR receiver_name LIKE CONCAT('%', p_search, '%')
    ORDER BY created_at DESC;
END //

DELIMITER ;

-- ===========================================
-- COMMANDS TO RUN
-- ===========================================

-- Copy and run these commands in MySQL:
-- 
-- 1. Create database:
-- CREATE DATABASE pan_logistics;
-- USE pan_logistics;
-- 
-- 2. Run this schema:
-- SOURCE /path/to/schema.sql;
-- 
-- 3. Or import via command line:
-- mysql -u root -p pan_logistics < schema.sql
