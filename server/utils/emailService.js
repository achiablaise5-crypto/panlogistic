/**
 * Email Service
 * Handles sending transactional emails
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
});

/**
 * Send booking confirmation email
 * @param {Object} bookingData - Booking information
 * @param {Object} booking - Created booking with tracking number
 */
const sendBookingConfirmation = async (bookingData, booking) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL || 'Pan Logistics <noreply@panlogistics.ca>',
        to: bookingData.sender_email,
        subject: `Booking Confirmed - Tracking #${booking.tracking_number}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0056b3, #003d82); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Pan Logistics</h1>
                </div>
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #0056b3;">Booking Confirmed!</h2>
                    <p>Thank you for booking with Pan Logistics. Your shipment has been confirmed.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #0056b3; margin-top: 0;">Tracking Number</h3>
                        <p style="font-size: 24px; font-weight: bold; color: #003d82;">${booking.tracking_number}</p>
                    </div>
                    
                    <h3 style="color: #0056b3;">Shipment Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;"><strong>Type:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">${bookingData.shipment_type}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;"><strong>Priority:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">${bookingData.delivery_priority}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;"><strong>Estimated Delivery:</strong></td>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">${booking.estimated_delivery}</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px;">Track your shipment anytime at: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking.html">Track Shipment</a></p>
                </div>
                <div style="padding: 20px; text-align: center; color: #6c757d; font-size: 12px;">
                    <p>&copy; 2024 Pan Logistics. All rights reserved.</p>
                </div>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent');
        return true;
    } catch (error) {
        console.error('Failed to send booking confirmation:', error);
        return false;
    }
};

/**
 * Send contact form confirmation email
 * @param {Object} data - Contact form data
 */
const sendContactConfirmation = async (data) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL || 'Pan Logistics <noreply@panlogistics.ca>',
        to: data.email,
        subject: 'Message Received - Pan Logistics',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0056b3, #003d82); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Pan Logistics</h1>
                </div>
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #0056b3;">Message Received!</h2>
                    <p>Thank you for contacting Pan Logistics. We have received your message and will get back to you within 24 hours.</p>
                    <p>If you have urgent inquiries, please call us at <strong>+1 (416) 555-0123</strong></p>
                </div>
                <div style="padding: 20px; text-align: center; color: #6c757d; font-size: 12px;">
                    <p>&copy; 2024 Pan Logistics. All rights reserved.</p>
                </div>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Contact confirmation email sent');
        return true;
    } catch (error) {
        console.error('Failed to send contact confirmation:', error);
        return false;
    }
};

/**
 * Send status update email
 * @param {Object} booking - Booking object
 */
const sendStatusUpdate = async (booking) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL || 'Pan Logistics <noreply@panlogistics.ca>',
        to: booking.sender_email,
        subject: `Shipment Update - ${booking.tracking_number}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0056b3, #003d82); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Pan Logistics</h1>
                </div>
                <div style="padding: 30px; background: #f8f9fa;">
                    <h2 style="color: #0056b3;">Shipment Status Update</h2>
                    <p>Your shipment status has been updated:</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="font-size: 18px; margin: 0;">Tracking Number</p>
                        <p style="font-size: 24px; font-weight: bold; color: #003d82;">${booking.tracking_number}</p>
                        <p style="font-size: 20px; color: #28a745; margin-top: 10px;">${booking.status}</p>
                    </div>
                    
                    <p>Track your shipment for more details: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking.html">Track Shipment</a></p>
                </div>
                <div style="padding: 20px; text-align: center; color: #6c757d; font-size: 12px;">
                    <p>&copy; 2024 Pan Logistics. All rights reserved.</p>
                </div>
            </div>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Status update email sent');
        return true;
    } catch (error) {
        console.error('Failed to send status update:', error);
        return false;
    }
};

module.exports = {
    sendBookingConfirmation,
    sendContactConfirmation,
    sendStatusUpdate
};
