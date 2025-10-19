// src/routes/reports.routes.js
const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const auth = require('../middlewares/auth.middleware');

// RBAC is removed for now; all authenticated users can access these.
router.get('/dashboard', auth, reportsController.getDashboardStats);
router.get('/inventory-summary', auth, reportsController.getInventorySummary);

module.exports = router;
