// src/controllers/stock.controller.js
const stockService = require('../services/stock.service');
const { success, error } = require('../utils/response');

// /stock-levels
async function listStockLevels(req, res) {
  const { warehouse_id, item_id } = req.query;
  const { data, error: svcErr } = await stockService.listStockLevels({ warehouse_id, item_id });
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getStockLevel(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await stockService.getStockLevelById(id);
  if (svcErr) return error(res, svcErr.message, 500);
  if (!data) return error(res, 'Stock level not found', 404);
  return success(res, data);
}

async function createStockLevel(req, res) {
  const payload = { ...req.body, created_by: req.user?.id };
  const { data, error: svcErr } = await stockService.createStockLevel(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Stock level created', 201);
}

async function updateStockLevel(req, res) {
  const { id } = req.params;
  const payload = { ...req.body, updated_by: req.user?.id };
  // This also creates a transaction
  const { data, error: svcErr } = await stockService.updateStockLevel(id, payload);
  if (svcErr) return error(res, svcErr.message, 500);
  
  // Also create an 'ADJUST' transaction
  await stockService.createTransaction({
      item_id: data.item_id,
      warehouse_id: data.warehouse_id,
      type: 'ADJUST',
      quantity: payload.quantity - data.quantity, // a bit simplistic
      notes: payload.reason || 'Manual stock adjustment',
      initiated_by: req.user?.id
  });

  return success(res, data, 'Stock level updated');
}


// /transactions
async function listTransactions(req, res) {
  const { warehouse_id, type } = req.query;
  const { data, error: svcErr } = await stockService.listTransactions({ warehouse_id, type });
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getTransaction(req, res) {
    const { id } = req.params;
    const { data, error: svcErr } = await stockService.getTransaction(id);
    if(svcErr) return error(res, svcErr.message, 500);
    if(!data) return error(res, 'Transaction not found', 404);
    return success(res, data);
}


async function createTransaction(req, res) {
  const payload = { ...req.body, initiated_by: req.user?.id };
  const { data, error: svcErr } = await stockService.createTransaction(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Transaction created', 201);
}

module.exports = { 
    listStockLevels,
    getStockLevel,
    createStockLevel,
    updateStockLevel,
    listTransactions, 
    getTransaction,
    createTransaction
};
