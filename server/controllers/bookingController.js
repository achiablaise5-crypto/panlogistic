/**
 * Booking Controller
 * Handles shipment booking operations
 */

const Booking = require('../models/Booking');
const { sendBookingConfirmation } = require('../utils/emailService');

/**
 * Create new booking
 * POST /api/bookings/create
 */
const createBooking = async (req, res) => {
    try {
        const bookingData = req.body;
        
        // Validate required fields
        const requiredFields = [
            'senderName', 'senderPhone', 'senderEmail', 'senderAddress',
            'receiverName', 'receiverPhone', 'receiverAddress', 'receiverCountry',
            'shipmentType', 'weight', 'cargoType', 'pickupDate', 'deliveryPriority'
        ];
        
        const missingFields = requiredFields.filter(field => !bookingData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Create booking
        const booking = await Booking.create(bookingData);
        
        // Send confirmation email
        try {
            await sendBookingConfirmation(bookingData, booking);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                booking_id: booking.id,
                tracking_number: booking.tracking_number,
                estimated_delivery: booking.estimated_delivery
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    }
};

/**
 * Get booking by tracking number
 * GET /api/bookings/:trackingNumber
 */
const getBookingByTracking = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        
        const booking = await Booking.findByTrackingNumber(trackingNumber);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        res.json({
            success: true,
            data: { booking }
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving booking'
        });
    }
};

/**
 * Get all bookings (admin only)
 * GET /api/bookings
 */
const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        
        const result = await Booking.findAll({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            search
        });
        
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving bookings'
        });
    }
};

/**
 * Get booking statistics (admin only)
 * GET /api/bookings/stats
 */
const getStatistics = async (req, res) => {
    try {
        const stats = await Booking.getStatistics();
        
        res.json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics'
        });
    }
};

/**
 * Update booking status (admin only)
 * PUT /api/bookings/:id/status
 */
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = [
            'Booked', 'Processing', 'In Transit', 
            'At Warehouse', 'Out for Delivery', 'Delivered'
        ];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        await Booking.updateStatus(id, status);
        
        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status'
        });
    }
};

/**
 * Update booking (admin only)
 * PUT /api/bookings/:id
 */
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const bookingData = req.body;
        
        await Booking.update(id, bookingData);
        
        res.json({
            success: true,
            message: 'Booking updated successfully'
        });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking'
        });
    }
};

/**
 * Delete booking (admin only)
 * DELETE /api/bookings/:id
 */
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Booking.deleteBooking(id);
        
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting booking'
        });
    }
};

module.exports = {
    createBooking,
    getBookingByTracking,
    getAllBookings,
    getStatistics,
    updateStatus,
    updateBooking,
    deleteBooking
};
