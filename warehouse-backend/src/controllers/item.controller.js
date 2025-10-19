// src/controllers/item.controller.js
const itemService = require('../services/item.service');
const { success, error } = require('../utils/response');

async function listItems(req, res) {
  // Check for low-stock query param
  if (req.path.includes('/low-stock')) {
      const { data, error: svcErr } = await itemService.getLowStockItems();
      if (svcErr) return error(res, svcErr.message || 'Unable to fetch low stock items', 500);
      return success(res, data);
  }

  const { data, error: svcErr } = await itemService.listItems();
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch items', 500);
  return success(res, data);
}

async function getItem(req, res) {
  const id = req.params.id;
  const { data, error: svcErr } = await itemService.getItem(id);
  if (svcErr) return error(res, svcErr.message || 'Unable to fetch item', 500);
  if (!data) return error(res, 'Item not found', 404);
  return success(res, data);
}

async function createItem(req, res) {
  const payload = { ...req.body, created_by: req.user?.id };
  const { data, error: svcErr } = await itemService.createItem(payload);
  if (svcErr) return error(res, svcErr.message || 'Create failed', 500);
  return success(res, data, 'Item created', 201);
}

async function updateItem(req, res) {
  const id = req.params.id;
  const payload = { ...req.body, updated_by: req.user?.id };
  const { data, error: svcErr } = await itemService.updateItem(id, payload);
  if (svcErr) return error(res, svcErr.message || 'Update failed', 500);
  return success(res, data, 'Item updated');
}

async function deleteItem(req, res) {
  const id = req.params.id;
  const { error: svcErr } = await itemService.deleteItem(id);
  if (svcErr) return error(res, svcErr.message || 'Delete failed', 500);
  return success(res, {}, 'Item deleted');
}

module.exports = { listItems, getItem, createItem, updateItem, deleteItem };
