// src/controllers/stock.controller.js
const stockService = require('../services/stock.service');
const { success, error } = require('../utils/response');

// --- READ OPERATIONS --- (No changes needed)
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
// --- END READ OPERATIONS ---


/**
 * FIXED: Handles manual stock adjustments via PUT /stock/levels/:id
 * Uses the centralized service function with type 'ADJUST'.
 */
async function updateStockLevel(req, res) {
    const { id } = req.params; // This is stock_id
    const payload = req.body; // Contains { quantity: newQuantity, reason: "..." }

    if (payload.quantity == null || payload.quantity < 0) {
        return error(res, 'New quantity is required and cannot be negative.', 400);
    }

    try {
        // First, get the stock level to find the item_id and warehouse_id
        const { data: currentStock, error: fetchErr } = await stockService.getStockLevelById(id);
        if (fetchErr || !currentStock) {
            return error(res, 'Stock level record not found for adjustment.', 404);
        }

        // Call the centralized function
        const { data, error: svcErr } = await stockService.updateStockAndLogTransaction({
            item_id: currentStock.item_id,
            warehouse_id: currentStock.warehouse_id,
            type: 'ADJUST',
            quantity: parseInt(payload.quantity, 10), // Pass the new target quantity
            notes: payload.reason || 'Manual stock adjustment'
            // initiated_by removed
        });

        if (svcErr) throw svcErr; // Let error handler catch it

        return success(res, data, 'Stock level adjusted and transaction logged');
    } catch (err) {
        // Catch errors from service (like insufficient stock if adjustment was negative)
        return error(res, err.message || 'Failed to adjust stock level.', 500);
    }
}


/**
 * FIXED: Handles IN/OUT transactions via POST /stock/transactions/(in|out)
 * Uses the new centralized service function.
 * Note: The 'ADJUST' route here is redundant if PUT /levels/:id is used, but kept for compatibility.
 */
async function createTransaction(req, res) {
  const payload = req.body; // Includes type set by the route

   if (!payload.item_id || !payload.warehouse_id || !payload.type || !payload.quantity || payload.quantity <= 0) {
        return error(res, 'Missing required fields or invalid quantity for transaction.', 400);
    }

  try {
    const { data, error: svcErr } = await stockService.updateStockAndLogTransaction({
        item_id: payload.item_id,
        warehouse_id: payload.warehouse_id,
        type: payload.type, // 'IN' or 'OUT' (or 'ADJUST' from legacy route)
        quantity: parseInt(payload.quantity, 10),
        notes: payload.notes
        // initiated_by removed
        // transfer_request_id might be relevant for non-transfer IN/OUT? Keep null for now.
    });

    if (svcErr) throw svcErr; // Let error handler catch it

    return success(res, data, 'Transaction logged and stock updated', 201);
   } catch (err) {
      // Catch errors like insufficient stock from the service
      return error(res, err.message || 'Failed to process transaction.', 500);
   }
}

// Deprecated - use updateStockAndLogTransaction
async function createStockLevel(req, res) {
  const payload = { ...req.body };
  // Should ideally use updateStockAndLogTransaction with type 'IN' or 'ADJUST'
  console.warn("Using deprecated createStockLevel controller");
  const { data, error: svcErr } = await stockService.createStockLevel(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Stock level created (Legacy)', 201);
}


module.exports = {
    listStockLevels,
    getStockLevel,
    updateStockLevel, // For manual adjustments
    listTransactions,
    getTransaction,
    createTransaction, // For IN/OUT transactions
    createStockLevel, // Legacy
};

