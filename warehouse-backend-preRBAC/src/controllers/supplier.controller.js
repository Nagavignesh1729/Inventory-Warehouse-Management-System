// src/controllers/supplier.controller.js
const supplierService = require('../services/supplier.service');
const { success, error } = require('../utils/response');

async function listSuppliers(req, res) {
  const { data, error: svcErr } = await supplierService.listSuppliers();
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getSupplier(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await supplierService.getSupplier(id);
  if (svcErr) return error(res, svcErr.message, 500);
  if (!data) return error(res, 'Supplier not found', 404);
  return success(res, data);
}

async function createSupplier(req, res) {
  const payload = { ...req.body, created_by: req.user?.id };
  const { data, error: svcErr } = await supplierService.createSupplier(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Supplier created', 201);
}

async function updateSupplier(req, res) {
  const { id } = req.params;
  const payload = { ...req.body, updated_by: req.user?.id };
  const { data, error: svcErr } = await supplierService.updateSupplier(id, payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Supplier updated');
}

async function deleteSupplier(req, res) {
  const { id } = req.params;
  const { error: svcErr } = await supplierService.deleteSupplier(id);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, {}, 'Supplier deleted');
}

module.exports = {
  listSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
