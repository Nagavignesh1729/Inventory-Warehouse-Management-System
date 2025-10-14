const inventoryService = require('../services/inventory.service');
const { success, error } = require('../utils/response');

async function getStock(req, res) {
  const { item_id, warehouse_id } = req.params;
  const { data, error: svcErr } = await inventoryService.getStock(item_id, warehouse_id);
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch stock', 500);
  if (!data) return success(res, { quantity: 0 }, 'No stock record', 200);
  return success(res, data);
}

async function setStock(req, res) {
  const { item_id, warehouse_id } = req.params;
  const { quantity } = req.body;
  if (quantity == null || quantity < 0) return error(res, 'quantity is required and must be >= 0', 400);
  const updated_by = req.user?.id || null;
  const { data, error: svcErr } = await inventoryService.setStock(item_id, warehouse_id, quantity, updated_by);
  if (svcErr) return error(res, svcErr.message || 'Unable to update stock', 500);
  return success(res, data, 'Stock updated');
}

async function createTransaction(req, res) {
  const payload = req.body;
  payload.initiated_by = req.user?.id || null;
  const { data, error: svcErr } = await inventoryService.createTransaction(payload);
  if (svcErr) return error(res, svcErr.message || 'Transaction failed', 500);
  return success(res, data, 'Transaction recorded', 201);
}

module.exports = { getStock, setStock, createTransaction };
