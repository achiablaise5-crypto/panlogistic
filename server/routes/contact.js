/**
 * Contact Routes
 * Contact form management endpoints
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, isStaff } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public route - submit contact form
router.post('/', validateContact, contactController.submitContact);

// Protected routes - admin/staff only
router.get('/messages', authenticate, isStaff, contactController.getMessages);
router.get('/unread-count', authenticate, isStaff, contactController.getUnreadCount);
router.put('/messages/:id/read', authenticate, isStaff, contactController.markAsRead);
router.delete('/messages/:id', authenticate, isStaff, contactController.deleteMessage);

module.exports = router;
