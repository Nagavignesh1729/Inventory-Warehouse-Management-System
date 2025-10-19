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
  // FIXED: Removed 'created_by' as it does not exist in the 'warehouses' table schema.
  // The 'updated_by' field will be handled on updates.
  const payload = { ...req.body };
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
