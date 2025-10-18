// src/routes/supplier.routes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorization.middleware');
const { ROLES } = require('../utils/constants');

router.get('/', auth, supplierController.listSuppliers);
router.get('/:id', auth, supplierController.getSupplier);
router.post('/', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), supplierController.createSupplier);
router.put('/:id', auth, authorize([ROLES.ADMIN, ROLES.MANAGER]), supplierController.updateSupplier);
router.delete('/:id', auth, authorize([ROLES.ADMIN]), supplierController.deleteSupplier);

module.exports = router;

