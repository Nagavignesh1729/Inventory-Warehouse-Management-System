// src/routes/warehouse.routes.js
const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');


router.get('/', auth, warehouseController.listWarehouses);
router.get('/:id', auth, warehouseController.getWarehouse);
router.post('/', auth, authorize([ROLES.ADMIN]), warehouseController.createWarehouse);
router.put('/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), warehouseController.updateWarehouse);
router.delete('/:id', auth, authorize([ROLES.ADMIN]), warehouseController.deleteWarehouse);

// Placeholders for other routes from docs
// router.get('/:id/users', auth, ...);
// router.get('/:id/capacity', auth, ...);
// router.get('/:id/stock-summary', auth, ...);


module.exports = router;

