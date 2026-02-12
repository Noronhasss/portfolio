/* =============================================
   BACKEND - CONTACT ROUTES
   API endpoints for contact form management
   ============================================= */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// ===== PUBLIC ROUTES =====

// POST - Create a new contact submission
// Route: POST /api/contacts
// Body: { name, email, message }
router.post('/', (req, res, next) => {
    console.log('📝 POST /api/contacts received');
    console.log('   Request body:', req.body);
    next();
}, contactController.createContact);

// ===== ADMIN ROUTES (Add authentication middleware in production) =====

// GET - Retrieve all contact submissions
// Route: GET /api/contacts
router.get('/', contactController.getAllContacts);

// GET - Retrieve a specific contact by ID
// Route: GET /api/contacts/:id
router.get('/:id', contactController.getContactById);

// PATCH - Update contact status
// Route: PATCH /api/contacts/:id
// Body: { status: 'new' | 'read' | 'responded' }
router.patch('/:id', contactController.updateContactStatus);

// DELETE - Remove a contact
// Route: DELETE /api/contacts/:id
router.delete('/:id', contactController.deleteContact);

module.exports = router;
