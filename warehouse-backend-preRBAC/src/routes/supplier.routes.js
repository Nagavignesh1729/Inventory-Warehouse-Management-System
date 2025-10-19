// src/routes/supplier.routes.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const auth = require('../middlewares/auth.middleware');

// RBAC is removed for now; all authenticated users can access these.
router.get('/', auth, supplierController.listSuppliers);
router.get('/:id', auth, supplierController.getSupplier);
router.post('/', auth, supplierController.createSupplier);
router.put('/:id', auth, supplierController.updateSupplier);
router.delete('/:id', auth, supplierController.deleteSupplier);

module.exports = router;
