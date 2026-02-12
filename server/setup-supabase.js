/**
 * Supabase Setup Script
 * Creates all required tables for Pan Logistics
 * 
 * Usage: node setup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://uchxmnhvonilorpuogab.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseKey) {
    console.error('Error: SUPABASE_SERVICE_KEY must be set in .env file');
    console.log('Please add SUPABASE_SERVICE_KEY to your server/.env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable(tableName, columns) {
    const colDefs = columns.map(col => `${col.name} ${col.type}`).join(', ');
    
    try {
        // Try using the REST API to create table via insert (will fail but tells us if connected)
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
            
        if (error && error.code === '42P01') { // undefined_table
            console.log(`⚠️  Table '${tableName}' does not exist - please create it in Supabase SQL Editor`);
            return false;
        }
        console.log(`✓ Table '${tableName}' exists`);
        return true;
    } catch (err) {
        console.log(`⚠️  Cannot verify '${tableName}': ${err.message}`);
        return false;
    }
}

async function insertSampleData() {
    console.log('\n📝 Inserting sample admin user...');
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
        email: 'admin@panlogistics.ca',
        password: hashedPassword,
        name: 'Pan Logistics Admin',
        role: 'admin',
        created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
        .from('users')
        .upsert([adminUser], { onConflict: 'email' })
        .select();
    
    if (error) {
        console.log(`⚠️  Could not create admin user: ${error.message}`);
    } else {
        console.log('✓ Admin user created/updated');
        console.log('   Email: admin@panlogistics.ca');
        console.log('   Password: admin123');
    }
}

async function setupDatabase() {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║   Pan Logistics - Supabase Setup                     ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    console.log(`Connecting to: ${supabaseUrl}`);
    
    // Test connection
    try {
        const { data, error } = await supabase.from('users').select('count').single();
        if (error && error.code !== 'PGRST116') {
            console.log(`Note: ${error.message}`);
        }
        console.log('✓ Connected to Supabase\n');
    } catch (err) {
        console.error(`✗ Connection failed: ${err.message}`);
        process.exit(1);
    }
    
    // Check tables
    console.log('Checking tables...\n');
    
    await createTable('users', [
        { name: 'id', type: 'UUID DEFAULT gen_random_uuid()' },
        { name: 'email', type: 'TEXT UNIQUE' },
        { name: 'password', type: 'TEXT' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT DEFAULT user' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE' }
    ]);
    
    await createTable('bookings', [
        { name: 'id', type: 'UUID DEFAULT gen_random_uuid()' },
        { name: 'tracking_number', type: 'TEXT UNIQUE' },
        { name: 'sender_name', type: 'TEXT' },
        { name: 'sender_email', type: 'TEXT' },
        { name: 'sender_phone', type: 'TEXT' },
        { name: 'sender_address', type: 'TEXT' },
        { name: 'receiver_name', type: 'TEXT' },
        { name: 'receiver_email', type: 'TEXT' },
        { name: 'receiver_phone', type: 'TEXT' },
        { name: 'receiver_address', type: 'TEXT' },
        { name: 'service_type', type: 'TEXT' },
        { name: 'status', type: 'TEXT DEFAULT pending' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE' }
    ]);
    
    await createTable('contact_messages', [
        { name: 'id', type: 'UUID DEFAULT gen_random_uuid()' },
        { name: 'name', type: 'TEXT' },
        { name: 'email', type: 'TEXT' },
        { name: 'phone', type: 'TEXT' },
        { name: 'subject', type: 'TEXT' },
        { name: 'message', type: 'TEXT' },
        { name: 'status', type: 'TEXT DEFAULT unread' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE' }
    ]);
    
    // Try to insert admin user
    await insertSampleData();
    
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║   Setup Complete!                                     ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    console.log('If tables do not exist, please run the SQL below in');
    console.log('your Supabase Dashboard → SQL Editor:\n');
    
    console.log('--- COPY FROM HERE ---');
    console.log(`
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    sender_address TEXT NOT NULL,
    receiver_name TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    receiver_address TEXT NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);
    console.log('--- COPY TO HERE ---\n');
}

setupDatabase().catch(console.error);
