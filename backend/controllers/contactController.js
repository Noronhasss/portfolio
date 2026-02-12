/* =============================================
   BACKEND - CONTACT CONTROLLER
   Business logic for handling contact form submissions
   ============================================= */

const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/emailService');

// ===== CREATE NEW CONTACT =====
// Handle incoming contact form submissions
const createContact = async (req, res) => {
    try {
        // Extract data from request body
        const { name, email, message } = req.body;
        
        console.log('📝 Creating contact:', { name, email });
        
        // Validate that all fields are provided
        if (!name || !email || !message) {
            console.log('❌ Validation failed: missing fields');
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        
        // Check if database is connected
        const dbConnected = require('mongoose').connection.readyState === 1;
        
        // If database is connected, save to MongoDB
        if (dbConnected) {
            const contact = new Contact({
                name,
                email,
                message
            });
            
            await contact.save();
            console.log('💾 Message saved to database');
        } else {
            console.log('⚠️  Database offline - message not saved to DB');
        }
        
        // Send email notification (non-blocking)
        sendContactEmail(name, email, message)
            .then((emailResult) => {
                if (emailResult.success) {
                    console.log(`📧 Email sent to ${process.env.EMAIL_RECEIVER}`);
                } else {
                    console.warn(`⚠️  Email not sent: ${emailResult.reason}`);
                }
            })
            .catch((err) => {
                console.error(`❌ Email error: ${err.message}`);
            });
        
        // Send success response regardless of database status
        res.status(201).json({
            success: true,
            message: 'Your message has been received! I\'ll get back to you soon.',
            databaseConnected: dbConnected
        });
        
        console.log(`✉️ New contact from: ${name} (${email})`);
        
    } catch (error) {
        console.error('Error creating contact:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check for validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            console.error('Validation error details:', messages);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }
        
        // Check if database is connected
        if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
            console.error('Database connection error');
            return res.status(503).json({
                success: false,
                message: 'Database connection error. Please try again later.'
            });
        }
        
        console.error('Unhandled error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving your message. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ===== GET ALL CONTACTS =====
// Retrieve all contact submissions (admin only)
const getAllContacts = async (req, res) => {
    try {
        // Fetch all contacts, sorted by newest first
        const contacts = await Contact.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
        
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts'
        });
    }
};

// ===== GET CONTACT BY ID =====
// Retrieve a specific contact submission
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find contact by ID
        const contact = await Contact.findById(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        // Mark as read if not already
        if (contact.status === 'new') {
            contact.status = 'read';
            await contact.save();
        }
        
        res.status(200).json({
            success: true,
            data: contact
        });
        
    } catch (error) {
        console.error('Error fetching contact:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact'
        });
    }
};

// ===== UPDATE CONTACT STATUS =====
// Update status of a contact (e.g., from 'new' to 'responded')
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status value
        const validStatuses = ['new', 'read', 'responded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }
        
        // Find and update contact
        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });
        
    } catch (error) {
        console.error('Error updating contact:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating contact'
        });
    }
};

// ===== DELETE CONTACT =====
// Remove a contact submission
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete contact
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting contact:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact'
        });
    }
};

// Export all controller functions
module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};
