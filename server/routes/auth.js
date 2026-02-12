/**
 * Auth Routes
 * Authentication and user management endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateLogin, validateRegister } = require('../middleware/validation');

// Public routes
router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authenticate, isAdmin, authController.register);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/password', authenticate, authController.changePassword);

// Admin only routes
router.get('/users', authenticate, isAdmin, authController.getAllUsers);
router.delete('/users/:id', authenticate, isAdmin, authController.deleteUser);

module.exports = router;
