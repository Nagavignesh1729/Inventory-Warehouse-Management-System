// src/routes/warehouse.routes.js
const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
const auth = require('../middlewares/auth.middleware');
// Removed authorize and ROLES imports

// RBAC is removed. All routes are accessible to any authenticated user.
router.get('/', auth, warehouseController.listWarehouses);
router.get('/:id', auth, warehouseController.getWarehouse);
router.post('/', auth, warehouseController.createWarehouse);
router.put('/:id', auth, warehouseController.updateWarehouse);
router.delete('/:id', auth, warehouseController.deleteWarehouse);

module.exports = router;

