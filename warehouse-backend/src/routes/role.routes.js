// src/routes/role.routes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

// ADMIN can create roles, all authenticated users can view them
router.get('/', auth, roleController.listRoles);
router.post('/', auth, authorize([ROLES.ADMIN]), roleController.createRole);

module.exports = router;
