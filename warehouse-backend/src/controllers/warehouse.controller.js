// src/controllers/warehouse.controller.js
const warehouseService = require('../services/warehouse.service');
const { success, error } = require('../utils/response');

async function listWarehouses(req, res) {
  const { data, error: svcErr } = await warehouseService.listWarehouses();
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getWarehouse(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await warehouseService.getWarehouse(id);
  if (svcErr) return error(res, svcErr.message, 500);
  if (!data) return error(res, 'Warehouse not found', 404);
  return success(res, data);
}

async function createWarehouse(req, res) {
  const payload = { ...req.body, created_by: req.user?.id };
  const { data, error: svcErr } = await warehouseService.createWarehouse(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Warehouse created', 201);
}

async function updateWarehouse(req, res) {
  const { id } = req.params;
  const payload = { ...req.body, updated_by: req.user?.id };
  const { data, error: svcErr } = await warehouseService.updateWarehouse(id, payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Warehouse updated');
}

async function deleteWarehouse(req, res) {
  const { id } = req.params;
  const { error: svcErr } = await warehouseService.deleteWarehouse(id);
  // You might want to check for dependency errors here, e.g., if svcErr.code === '23503' for foreign key violation
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, {}, 'Warehouse deleted');
}

module.exports = {
  listWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
