/**
 * Tracking Routes
 * Shipment tracking endpoints
 */

const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Public routes
router.get('/:trackingNumber', trackingController.trackShipment);
router.get('/validate/:trackingNumber', trackingController.validateTracking);

module.exports = router;
