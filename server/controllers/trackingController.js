/**
 * Tracking Controller
 * Handles shipment tracking operations
 */

const Booking = require('../models/Booking');

/**
 * Track shipment by tracking number
 * GET /api/tracking/:trackingNumber
 */
const trackShipment = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        
        if (!trackingNumber) {
            return res.status(400).json({
                success: false,
                message: 'Tracking number is required'
            });
        }
        
        const booking = await Booking.findByTrackingNumber(trackingNumber.toUpperCase());
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found. Please check your tracking number.'
            });
        }
        
        // Calculate progress percentage based on status
        const statusProgress = {
            'Booked': 20,
            'Processing': 35,
            'In Transit': 50,
            'At Warehouse': 70,
            'Out for Delivery': 90,
            'Delivered': 100
        };
        
        const progress = statusProgress[booking.status] || 0;
        
        // Build timeline based on status
        const timeline = buildTimeline(booking);
        
        res.json({
            success: true,
            data: {
                tracking_number: booking.tracking_number,
                status: booking.status,
                progress,
                shipment_details: {
                    type: booking.shipment_type,
                    cargo_type: booking.cargo_type,
                    weight: `${booking.weight} kg`,
                    dimensions: booking.dimensions || 'N/A',
                    priority: booking.delivery_priority
                },
                sender: {
                    name: booking.sender_name,
                    company: booking.sender_company,
                    address: booking.sender_address,
                    phone: booking.sender_phone,
                    email: booking.sender_email
                },
                receiver: {
                    name: booking.receiver_name,
                    address: booking.receiver_address,
                    country: booking.receiver_country,
                    phone: booking.receiver_phone
                },
                dates: {
                    pickup: booking.pickup_date,
                    estimated_delivery: booking.estimated_delivery,
                    last_updated: booking.updated_at
                },
                timeline
            }
        });
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking shipment'
        });
    }
};

/**
 * Build shipment timeline based on current status
 * @param {Object} booking - Booking object
 * @returns {Array} Timeline events
 */
const buildTimeline = (booking) => {
    const events = [
        {
            status: 'Order Placed',
            title: 'Order Booked',
            description: 'Shipment order has been confirmed',
            completed: true,
            date: booking.created_at
        },
        {
            status: 'Processing',
            title: 'Processing',
            description: 'Shipment is being processed',
            completed: ['Processing', 'In Transit', 'At Warehouse', 'Out for Delivery', 'Delivered'].includes(booking.status),
            date: booking.status !== 'Booked' ? booking.updated_at : null
        },
        {
            status: 'In Transit',
            title: 'In Transit',
            description: 'Package is on its way',
            completed: ['In Transit', 'At Warehouse', 'Out for Delivery', 'Delivered'].includes(booking.status),
            date: null
        },
        {
            status: 'At Warehouse',
            title: 'At Warehouse',
            description: 'Package arrived at distribution center',
            completed: ['At Warehouse', 'Out for Delivery', 'Delivered'].includes(booking.status),
            date: null
        },
        {
            status: 'Out for Delivery',
            title: 'Out for Delivery',
            description: 'Package is out for final delivery',
            completed: ['Out for Delivery', 'Delivered'].includes(booking.status),
            date: null
        },
        {
            status: 'Delivered',
            title: 'Delivered',
            description: 'Package has been delivered',
            completed: booking.status === 'Delivered',
            date: booking.status === 'Delivered' ? booking.updated_at : null
        }
    ];
    
    return events;
};

/**
 * Validate tracking number format
 * GET /api/tracking/validate/:trackingNumber
 */
const validateTracking = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        
        // Check format (PAN-XXXXX-XXXXX)
        const formatRegex = /^PAN-[A-Z0-9]+-[A-Z0-9]+$/i;
        const isValidFormat = formatRegex.test(trackingNumber);
        
        if (!isValidFormat) {
            return res.json({
                success: true,
                data: {
                    valid: false,
                    message: 'Invalid tracking number format'
                }
            });
        }
        
        // Check if exists
        const booking = await Booking.findByTrackingNumber(trackingNumber.toUpperCase());
        
        res.json({
            success: true,
            data: {
                valid: !!booking,
                exists: !!booking,
                message: booking ? 'Tracking number found' : 'Tracking number not found'
            }
        });
    } catch (error) {
        console.error('Validate tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error validating tracking number'
        });
    }
};

module.exports = {
    trackShipment,
    validateTracking
};
