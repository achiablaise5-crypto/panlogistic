/**
 * Supabase Configuration
 * PostgreSQL Database Connection via Supabase SDK
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://uchxmnhvonilorpuogab.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Test Supabase connection
 */
const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count').single();
        if (error && error.code !== 'PGRST116') {
            console.error('Supabase connection error:', error.message);
            return false;
        }
        console.log('✅ Supabase connected successfully');
        return true;
    } catch (error) {
        console.error('Supabase connection failed:', error.message);
        return false;
    }
};

/**
 * Generic query helper
 */
const query = async (table, options = {}) => {
    let query = supabase.from(table).select(options.select || '*');
    
    if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
        });
    }
    
    if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? false });
    }
    
    if (options.limit) {
        query = query.limit(options.limit);
    }
    
    if (options.offset) {
        query = query.offset(options.offset);
    }
    
    const { data, error } = await query;
    
    if (error) {
        console.error(`Query error on ${table}:`, error);
        throw error;
    }
    
    return data;
};

/**
 * Insert helper
 */
const insert = async (table, data) => {
    const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
    
    if (error) {
        console.error(`Insert error on ${table}:`, error);
        throw error;
    }
    
    return result;
};

/**
 * Update helper
 */
const update = async (table, id, data) => {
    const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error(`Update error on ${table}:`, error);
        throw error;
    }
    
    return result;
};

/**
 * Delete helper
 */
const remove = async (table, id) => {
    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error(`Delete error on ${table}:`, error);
        throw error;
    }
    
    return true;
};

/**
 * Custom RPC call (for complex queries)
 */
const rpc = async (functionName, params = {}) => {
    const { data, error } = await supabase
        .rpc(functionName, params);
    
    if (error) {
        console.error(`RPC error: ${functionName}:`, error);
        throw error;
    }
    
    return data;
};

module.exports = {
    supabase,
    testConnection,
    query,
    insert,
    update,
    remove,
    rpc
};
