// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import all modular route files
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const roleRoutes = require('./role.routes');
const warehouseRoutes = require('./warehouse.routes');
const categoryRoutes = require('./category.routes');
const supplierRoutes = require('./supplier.routes');
const itemRoutes = require('./item.routes');
const stockRoutes = require('./stock.routes');
const transferRoutes = require('./transfer.routes');
const reportRoutes = require('./reports.routes');

// Mount each module on its correct base path as per the API documentation
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/items', itemRoutes);
router.use('/stock', stockRoutes); // This will handle both /stock/levels and /stock/transactions
router.use('/transfer-requests', transferRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
