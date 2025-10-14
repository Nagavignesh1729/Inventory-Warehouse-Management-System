// src/routes/warehouse.routes.js

const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Warehouse route working' });
});

module.exports = router;
