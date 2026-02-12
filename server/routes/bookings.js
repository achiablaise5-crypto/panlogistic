/**
 * Booking Routes
 * Shipment booking management endpoints
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, isStaff, isAdmin } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

// Public route - create booking
router.post('/create', validateBooking, bookingController.createBooking);

// Public route - track booking
router.get('/:trackingNumber', bookingController.getBookingByTracking);

// Protected routes - admin/staff only
router.get('/', authenticate, isStaff, bookingController.getAllBookings);
router.get('/stats', authenticate, isStaff, bookingController.getStatistics);
router.put('/:id/status', authenticate, isStaff, bookingController.updateStatus);
router.put('/:id', authenticate, isStaff, bookingController.updateBooking);
router.delete('/:id', authenticate, isAdmin, bookingController.deleteBooking);

module.exports = router;
