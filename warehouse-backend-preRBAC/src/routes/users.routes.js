// src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');
const auth = require('../middlewares/auth.middleware');
// Removed authorize and ROLES

// Public route for new user registration
router.post('/register', usersController.registerUser);

// All other user routes are accessible to any logged-in user
router.get('/', auth, usersController.listUsers);
router.get('/:id', auth, usersController.getUser);
router.post('/', auth, usersController.createUser);
router.put('/:id', auth, usersController.updateUser);
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;

