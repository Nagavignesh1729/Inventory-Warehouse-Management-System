// src/routes/reports.routes.js
const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

// This single endpoint can provide all the data for the frontend dashboard
router.get('/dashboard', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), reportsController.getDashboardStats);

// Corresponds to /reports/inventory-summary
router.get('/inventory-summary', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), reportsController.getInventorySummary);

// Add other report routes as per the documentation
// router.get('/stock-movement', auth, ...);
// router.get('/warehouse-utilization', auth, ...);

module.exports = router;

