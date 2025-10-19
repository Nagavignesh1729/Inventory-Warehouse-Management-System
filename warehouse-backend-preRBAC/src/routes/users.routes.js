// src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');
const auth = require('../middlewares/auth.middleware');

// Public route for new user registration remains unchanged
router.post('/register', usersController.registerUser);

// --- All other user routes are now accessible to any logged-in user ---
// This is suitable for a single-user mode or during development before RBAC is on the frontend.
router.get('/', auth, usersController.listUsers);
router.get('/:id', auth, usersController.getUser);
router.post('/', auth, usersController.createUser);
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;
