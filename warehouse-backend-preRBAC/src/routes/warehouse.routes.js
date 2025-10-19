// src/routes/warehouse.routes.js
const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
const auth = require('../middlewares/auth.middleware');

// RBAC is removed for now; all authenticated users can access these.
router.get('/', auth, warehouseController.listWarehouses);
router.get('/:id', auth, warehouseController.getWarehouse);
router.post('/', auth, warehouseController.createWarehouse);
router.put('/:id', auth, warehouseController.updateWarehouse);
router.delete('/:id', auth, warehouseController.deleteWarehouse);

module.exports = router;
