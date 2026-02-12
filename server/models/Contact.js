/**
 * Contact Model - Supabase Version
 * Handles all database operations for contact messages
 */

const { supabase, query, insert, update, remove } = require('../config/supabase');

/**
 * Create a new contact message
 */
const create = async (messageData) => {
    const data = {
        name: messageData.name,
        email: messageData.email.toLowerCase(),
        phone: messageData.phone || null,
        subject: messageData.subject || null,
        message: messageData.message,
        is_read: false
    };
    
    const result = await insert('contact_messages', data);
    return result.id;
};

/**
 * Get all messages with pagination
 */
const findAll = async (options = {}) => {
    const { page = 1, limit = 10, unreadOnly = false } = options;
    
    let queryBuilder = supabase
        .from('contact_messages')
        .select('*', { count: 'exact' });
    
    if (unreadOnly) {
        queryBuilder = queryBuilder.eq('is_read', false);
    }
    
    queryBuilder = queryBuilder
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);
    
    const { data, error, count } = await queryBuilder;
    
    if (error) {
        console.error('findAll error:', error);
        throw error;
    }
    
    return {
        data: data || [],
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        }
    };
};

/**
 * Find message by ID
 */
const findById = async (id) => {
    const results = await query('contact_messages', {
        select: '*',
        filters: { id: id }
    });
    return results[0] || null;
};

/**
 * Mark message as read
 */
const markAsRead = async (id) => {
    await update('contact_messages', id, { is_read: true });
    return true;
};

/**
 * Delete message
 */
const deleteMessage = async (id) => {
    return await remove('contact_messages', id);
};

/**
 * Get unread message count
 */
const getUnreadCount = async () => {
    const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
    
    if (error) {
        console.error('getUnreadCount error:', error);
        throw error;
    }
    
    return count || 0;
};

module.exports = {
    create,
    findAll,
    findById,
    markAsRead,
    deleteMessage,
    getUnreadCount
};
