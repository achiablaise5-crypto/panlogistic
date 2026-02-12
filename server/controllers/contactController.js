/**
 * Contact Controller
 * Handles contact form submissions
 */

const Contact = require('../models/Contact');
const { sendContactConfirmation } = require('../utils/emailService');

/**
 * Submit contact form
 * POST /api/contact
 */
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and message'
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        // Create contact message
        const messageId = await Contact.create({ name, email, phone, subject, message });
        
        // Send confirmation email
        try {
            await sendContactConfirmation({ name, email });
        } catch (emailError) {
            console.error('Confirmation email failed:', emailError);
        }
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully. We will get back to you soon.',
            data: { message_id: messageId }
        });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting message'
        });
    }
};

/**
 * Get all messages (admin only)
 * GET /api/contact/messages
 */
const getMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, unreadOnly } = req.query;
        
        const result = await Contact.findAll({
            page: parseInt(page),
            limit: parseInt(limit),
            unreadOnly: unreadOnly === 'true'
        });
        
        res.json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving messages'
        });
    }
};

/**
 * Get unread message count (admin only)
 * GET /api/contact/unread-count
 */
const getUnreadCount = async (req, res) => {
    try {
        const count = await Contact.getUnreadCount();
        
        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving unread count'
        });
    }
};

/**
 * Mark message as read (admin only)
 * PUT /api/contact/messages/:id/read
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Contact.markAsRead(id);
        
        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking message as read'
        });
    }
};

/**
 * Delete message (admin only)
 * DELETE /api/contact/messages/:id
 */
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Contact.deleteMessage(id);
        
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message'
        });
    }
};

module.exports = {
    submitContact,
    getMessages,
    getUnreadCount,
    markAsRead,
    deleteMessage
};
