/**
 * Database Setup Script
 * Run this to create all database tables in Supabase
 * 
 * Usage: node setup-db.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('Setting up database tables...\n');

    try {
        // Create users table
        console.log('Creating users table...');
        const { error: usersError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS users (
                    id BIGSERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            `
        });

        if (usersError) {
            // If RPC doesn't work, try using the REST API to insert a record
            console.log('Note: Using alternative method for users table...');
            
            // Try to create table via direct insert (will fail if table doesn't exist)
            const { error: insertError } = await supabase
                .from('users')
                .select('*')
                .limit(1);
            
            if (insertError && insertError.message.includes('relation "users" does not exist')) {
                console.log('Please run the SQL manually in Supabase Dashboard:');
                console.log('1. Go to https://uchxmnhvonilorpuogab.supabase.co');
                console.log('2. Go to SQL Editor');
                console.log('3. Copy and run the contents of server/database/supabase-schema.sql');
            }
        } else {
            console.log('Users table created/verified successfully!');
        }

        // Create bookings table
        console.log('\nCreating bookings table...');
        const { error: bookingsError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS bookings (
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
                
                CREATE INDEX IF NOT EXISTS idx_bookings_tracking ON bookings(tracking_number);
                CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
                CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);
            `
        });

        if (bookingsError) {
            console.log('Bookings table setup requires manual SQL execution.');
        } else {
            console.log('Bookings table created/verified successfully!');
        }

        // Create contact_messages table
        console.log('\nCreating contact_messages table...');
        const { error: contactError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS contact_messages (
                    id BIGSERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    phone VARCHAR(50),
                    subject VARCHAR(255),
                    message TEXT NOT NULL,
                    is_read BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_messages(email);
                CREATE INDEX IF NOT EXISTS idx_contact_is_read ON contact_messages(is_read);
            `
        });

        if (contactError) {
            console.log('Contact messages table setup requires manual SQL execution.');
        } else {
            console.log('Contact messages table created/verified successfully!');
        }

        console.log('\n✅ Database setup complete!');
        console.log('\nIf you see errors above, please run the SQL manually:');
        console.log('1. Go to https://uchxmnhvonilorpuogab.supabase.co');
        console.log('2. Go to SQL Editor');
        console.log('3. Copy and run server/database/supabase-schema.sql');

    } catch (error) {
        console.error('Error setting up database:', error.message);
        console.log('\nPlease run the SQL manually in Supabase Dashboard:');
        console.log('1. Go to https://uchxmnhvonilorpuogab.supabase.co');
        console.log('2. Go to SQL Editor');
        console.log('3. Copy and run the contents of server/database/supabase-schema.sql');
    }
}

setupDatabase();
