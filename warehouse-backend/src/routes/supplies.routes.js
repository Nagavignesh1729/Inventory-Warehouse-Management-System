const express = require('express');
const router = express.Router();
const supService = require('../services/supplier.service');
const auth = require('../middlewares/auth.middleware');
const { success, error } = require('../utils/response');

router.get('/', auth, async (req, res) => {
  const { data, error: e } = await supService.listSuppliers();
  if (e) return error(res, e.message || 'Error');
  return success(res, data);
});

router.post('/', auth, async (req, res) => {
  const { data, error: e } = await supService.createSupplier(req.body);
  if (e) return error(res, e.message || 'Error');
  return success(res, data, 'Supplier created', 201);
});

module.exports = router;
