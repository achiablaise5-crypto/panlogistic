-- ===========================================
-- Pan Logistics - PostgreSQL Schema for Supabase
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- USERS TABLE
-- ===========================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ===========================================
-- BOOKINGS TABLE
-- ===========================================
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
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
    shipment_type VARCHAR(50) NOT NULL CHECK (shipment_type IN ('Air Freight', 'Sea Freight', 'Land Transport')),
    weight DECIMAL(10,2) NOT NULL,
    dimensions VARCHAR(100),
    cargo_type VARCHAR(100) NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_priority VARCHAR(20) NOT NULL CHECK (delivery_priority IN ('Standard', 'Express', 'Urgent')),
    status VARCHAR(50) DEFAULT 'Booked' CHECK (status IN ('Booked', 'Processing', 'In Transit', 'At Warehouse', 'Out for Delivery', 'Delivered')),
    estimated_delivery DATE,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_bookings_tracking ON bookings(tracking_number);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at);
CREATE INDEX idx_bookings_sender_email ON bookings(sender_email);

-- ===========================================
-- CONTACT_MESSAGES TABLE
-- ===========================================
DROP TABLE IF EXISTS contact_messages;
CREATE TABLE contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_contact_email ON contact_messages(email);
CREATE INDEX idx_contact_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_created ON contact_messages(created_at);

-- ===========================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- Enable RLS for additional security
-- ===========================================

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- SAMPLE DATA - Insert default admin user
-- Password: admin123 (hashed)
-- ===========================================

INSERT INTO users (name, email, password, role) VALUES 
(
    'Admin User',
    'admin@panlogistics.ca',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- SAMPLE BOOKINGS DATA
-- ===========================================

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
    CURRENT_DATE,
    'Express',
    CURRENT_DATE + INTERVAL '5 days',
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
    CURRENT_DATE - INTERVAL '10 days',
    'Standard',
    CURRENT_DATE + INTERVAL '15 days',
    'Delivered'
);

-- ===========================================
-- SAMPLE CONTACT MESSAGES
-- ===========================================

INSERT INTO contact_messages (name, email, phone, subject, message) VALUES 
(
    'David Smith',
    'david@company.com',
    '+1 (416) 555-0654',
    'Shipping Inquiry',
    'I would like to get a quote for shipping 500 kg of electronics from Toronto to Los Angeles.'
);

-- ===========================================
-- Supabase Dashboard Setup Instructions:
-- ===========================================
-- 1. Go to https://uchxmnhvonilorpuogab.supabase.co
-- 2. Login to your Supabase account
-- 3. Go to SQL Editor
-- 4. Copy and paste this entire file
-- 5. Run the query
-- 6. Tables will be created automatically
