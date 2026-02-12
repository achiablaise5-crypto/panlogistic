/**
 * Booking Model - Supabase Version
 * Handles all database operations for shipments/bookings using Supabase
 */

const { supabase, query, insert, update, remove } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate unique tracking number
 * @returns {string} Unique tracking number
 */
const generateTrackingNumber = async () => {
    let trackingNumber;
    let exists = true;
    
    while (exists) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = uuidv4().split('-')[0].toUpperCase();
        trackingNumber = `PAN-${timestamp}-${random}`;
        
        const results = await query('bookings', {
            select: 'id',
            filters: { tracking_number: trackingNumber }
        });
        exists = results.length > 0;
    }
    
    return trackingNumber;
};

/**
 * Calculate estimated delivery date
 */
const calculateEstimatedDelivery = (shipmentType, priority) => {
    const date = new Date();
    let days = 0;
    
    switch (shipmentType) {
        case 'Air Freight':
            days = priority === 'Urgent' ? 3 : priority === 'Express' ? 5 : 7;
            break;
        case 'Sea Freight':
            days = priority === 'Urgent' ? 14 : priority === 'Express' ? 21 : 30;
            break;
        case 'Land Transport':
            days = priority === 'Urgent' ? 1 : priority === 'Express' ? 3 : 5;
            break;
        default:
            days = 7;
    }
    
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

/**
 * Create a new booking
 */
const create = async (bookingData) => {
    const trackingNumber = await generateTrackingNumber();
    const estimatedDelivery = calculateEstimatedDelivery(
        bookingData.shipmentType,
        bookingData.deliveryPriority
    );
    
    const data = {
        tracking_number: trackingNumber,
        sender_name: bookingData.senderName,
        sender_company: bookingData.senderCompany || null,
        sender_phone: bookingData.senderPhone,
        sender_email: bookingData.senderEmail,
        sender_address: bookingData.senderAddress,
        receiver_name: bookingData.receiverName,
        receiver_phone: bookingData.receiverPhone,
        receiver_address: bookingData.receiverAddress,
        receiver_country: bookingData.receiverCountry,
        shipment_type: bookingData.shipmentType,
        weight: parseFloat(bookingData.weight),
        dimensions: bookingData.dimensions || null,
        cargo_type: bookingData.cargoType,
        pickup_date: bookingData.pickupDate,
        delivery_priority: bookingData.deliveryPriority,
        estimated_delivery: estimatedDelivery,
        special_instructions: bookingData.specialInstructions || null,
        status: 'Booked'
    };
    
    const result = await insert('bookings', data);
    
    return {
        id: result.id,
        tracking_number: result.tracking_number,
        estimated_delivery: result.estimated_delivery
    };
};

/**
 * Find booking by tracking number
 */
const findByTrackingNumber = async (trackingNumber) => {
    const results = await query('bookings', {
        select: '*',
        filters: { tracking_number: trackingNumber.toUpperCase() }
    });
    return results[0] || null;
};

/**
 * Find booking by ID
 */
const findById = async (id) => {
    const results = await query('bookings', {
        select: '*',
        filters: { id: id }
    });
    return results[0] || null;
};

/**
 * Get all bookings with pagination
 */
const findAll = async (options = {}) => {
    const { page = 1, limit = 10, status, search } = options;
    
    let queryBuilder = supabase
        .from('bookings')
        .select('*', { count: 'exact' });
    
    // Apply filters
    if (status) {
        queryBuilder = queryBuilder.eq('status', status);
    }
    
    if (search) {
        queryBuilder = queryBuilder.or(`tracking_number.ilike.%${search}%,sender_name.ilike.%${search}%,receiver_name.ilike.%${search}%`);
    }
    
    // Apply pagination
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
 * Update booking status
 */
const updateStatus = async (id, status) => {
    const validStatuses = [
        'Booked', 'Processing', 'In Transit', 
        'At Warehouse', 'Out for Delivery', 'Delivered'
    ];
    
    if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
    }
    
    return await update('bookings', id, { status });
};

/**
 * Update booking
 */
const updateBooking = async (id, bookingData) => {
    // Remove fields that shouldn't be updated
    const { id: _, tracking_number, created_at, ...updateData } = bookingData;
    
    return await update('bookings', id, updateData);
};

/**
 * Delete booking
 */
const deleteBooking = async (id) => {
    return await remove('bookings', id);
};

/**
 * Get booking statistics
 */
const getStatistics = async () => {
    const { data, error } = await supabase
        .from('bookings')
        .select('status', { count: 'exact' });
    
    if (error) {
        console.error('getStatistics error:', error);
        throw error;
    }
    
    const stats = {
        total: 0,
        delivered: 0,
        in_transit: 0,
        pending: 0
    };
    
    data.forEach(booking => {
        stats.total++;
        if (booking.status === 'Delivered') stats.delivered++;
        else if (booking.status === 'In Transit') stats.in_transit++;
        else if (booking.status === 'Booked' || booking.status === 'Processing') stats.pending++;
    });
    
    return stats;
};

module.exports = {
    generateTrackingNumber,
    calculateEstimatedDelivery,
    create,
    findByTrackingNumber,
    findById,
    findAll,
    updateStatus,
    update: updateBooking,
    deleteBooking,
    getStatistics
};
