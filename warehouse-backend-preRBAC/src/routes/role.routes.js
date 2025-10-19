// src/routes/role.routes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const auth = require('../middlewares/auth.middleware');

// RBAC is removed for now; all authenticated users can access these.
router.get('/', auth, roleController.listRoles);
router.post('/', auth, roleController.createRole);

module.exports = router;
