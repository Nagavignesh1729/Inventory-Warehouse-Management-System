// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

// Corresponds to POST /auth/signup in the documentation
router.post('/signup', authController.signUp);

// Corresponds to POST /auth/login in the documentation
router.post('/login', authController.signIn);

// Corresponds to POST /auth/logout in the documentation
router.post('/logout', auth, authController.signOut);

// Corresponds to GET /users/me in the documentation
router.get('/me', auth, authController.getCurrentUser);

// Corresponds to PUT /auth/change-password
router.put('/change-password', auth, authController.changePassword);

// Corresponds to POST /auth/refresh
router.post('/refresh', authController.refreshToken);


module.exports = router;