/* =============================================
   BACKEND - CONTACT MODEL
   Mongoose schema for contact form submissions
   ============================================= */

const mongoose = require('mongoose');

// Define the Contact schema
const contactSchema = new mongoose.Schema(
    {
        // User's full name
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters']
        },
        
        // User's email address
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address'
            ]
        },
        
        // Contact message
        message: {
            type: String,
            required: [true, 'Please provide a message'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [5000, 'Message cannot exceed 5000 characters']
        },
        
        // Status of the message (new, read, responded)
        status: {
            type: String,
            enum: ['new', 'read', 'responded'],
            default: 'new'
        }
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Create and export the Contact model
module.exports = mongoose.model('Contact', contactSchema);
