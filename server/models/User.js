/**
 * User Model - Supabase Version
 * Handles all database operations for users
 */

const { supabase, query, insert, update, remove } = require('../config/supabase');
const bcrypt = require('bcryptjs');

/**
 * Find user by email
 */
const findByEmail = async (email) => {
    const results = await query('users', {
        select: '*',
        filters: { email: email.toLowerCase() }
    });
    return results[0] || null;
};

/**
 * Find user by ID
 */
const findById = async (id) => {
    const results = await query('users', {
        select: 'id, name, email, role, created_at',
        filters: { id: id }
    });
    return results[0] || null;
};

/**
 * Create a new user
 */
const create = async (userData) => {
    const { name, email, password, role = 'staff' } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const data = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role
    };
    
    const result = await insert('users', data);
    return result.id;
};

/**
 * Update user password
 */
const updatePassword = async (id, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await update('users', id, { password: hashedPassword });
    return true;
};

/**
 * Get all users
 */
const findAll = async () => {
    const results = await query('users', {
        select: 'id, name, email, role, created_at',
        filters: {}
    });
    
    // Sort by created_at desc manually since Supabase JS doesn't support ordering in basic query
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Update user role
 */
const updateRole = async (id, role) => {
    const validRoles = ['admin', 'staff'];
    if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
    }
    
    await update('users', id, { role });
    return true;
};

/**
 * Delete user
 */
const deleteUser = async (id) => {
    return await remove('users', id);
};

module.exports = {
    findByEmail,
    findById,
    create,
    updatePassword,
    findAll,
    updateRole,
    deleteUser
};
