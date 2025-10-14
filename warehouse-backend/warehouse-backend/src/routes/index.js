// src/routes/index.js

const express = require('express');
const router = express.Router();

// Import individual route files
const warehouseRoutes = require('./warehouse.routes'); // example route file

// Mount routes
router.use('/warehouse', warehouseRoutes);

// You can add more routes here in the same way
// const userRoutes = require('./user.routes');
// router.use('/users', userRoutes);

module.exports = router;
