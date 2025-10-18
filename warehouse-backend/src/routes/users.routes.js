// src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

// Public route for new user registration
router.post('/register', usersController.registerUser);

// Authenticated and Authorized routes
router.get('/', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), usersController.listUsers);
router.get('/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), usersController.getUser);
router.post('/', auth, authorize([ROLES.ADMIN]), usersController.createUser);
router.put('/:id', auth, authorize([ROLES.ADMIN]), usersController.updateUser);
router.delete('/:id', auth, authorize([ROLES.ADMIN]), usersController.deleteUser);

module.exports = router;
