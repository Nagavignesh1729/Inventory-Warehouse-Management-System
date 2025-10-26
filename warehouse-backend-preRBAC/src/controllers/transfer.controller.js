// src/controllers/transfer.controller.js
const transferService = require('../services/transfer.service');
const stockService = require('../services/stock.service');
const { success, error } = require('../utils/response');

// --- READ OPERATIONS --- (No changes needed)
async function listTransfers(req, res) {
  const { status_id } = req.query; // Filter by status ID if provided
  const { data, error: svcErr } = await transferService.listTransfers({ status_id });
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getTransfer(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await transferService.getTransfer(id);
  if (svcErr) return error(res, svcErr.message, 500);
  if (!data) return error(res, 'Transfer request not found', 404);
  return success(res, data);
}
// --- END READ OPERATIONS ---


/**
 * FIXED: Validates stock before creating a PENDING request.
 * Removed user tracking fields.
 */
async function createTransfer(req, res) {
  try {
    const payload = req.body; // { item_id, source_warehouse_id, dest_warehouse_id, quantity, reason }

    // Basic payload validation
    if (!payload.item_id || !payload.source_warehouse_id || !payload.dest_warehouse_id || !payload.quantity || payload.quantity <= 0) {
        return error(res, 'Missing required fields or invalid quantity for transfer request.', 400);
    }
    if (payload.source_warehouse_id === payload.dest_warehouse_id) {
        return error(res, 'Source and destination warehouses cannot be the same.', 400);
    }

    // --- 1. VALIDATE STOCK ---
    const { data: stockData, error: stockErr } = await stockService.listStockLevels({
        item_id: payload.item_id,
        warehouse_id: payload.source_warehouse_id
    });
    if (stockErr) throw stockErr; // Let handler catch DB errors

    const currentStock = stockData.length > 0 ? stockData[0].quantity : 0;
    if (currentStock < payload.quantity) {
        throw new Error(`Insufficient stock to create request. Available: ${currentStock}, Requested: ${payload.quantity}`);
    }
    // --- END VALIDATION ---

    // Create the transfer request (status will be set to PENDING by default/service)
    const { data, error: svcErr } = await transferService.createTransfer({
        item_id: payload.item_id,
        source_warehouse_id: payload.source_warehouse_id,
        dest_warehouse_id: payload.dest_warehouse_id,
        quantity: parseInt(payload.quantity, 10),
        reason: payload.reason || null
        // requested_by removed
    });
    if (svcErr) throw svcErr;

    return success(res, data, 'Transfer request created successfully', 201);

  } catch(err) {
      // Catch validation errors (insufficient stock) or DB errors
      return error(res, err.message || 'Error creating transfer request', err.message.startsWith('Insufficient stock') ? 400 : 500);
  }
}

/**
 * FIXED: Re-validates stock before APPROVING.
 * FIXED: Uses centralized stock service on COMPLETE.
 * Removed user tracking fields.
 */
const updateTransferStatus = (newStatusName) => async (req, res) => {
    try {
        const { id } = req.params; // This is transfer_id

        // 1. Fetch the transfer request with details
        const { data: transfer, error: fetchErr } = await transferService.getTransfer(id);
        if (fetchErr || !transfer) throw new Error('Transfer request not found');

        const currentStatusName = transfer.status?.status_name; // Assuming status relation is joined

        // 2. State machine validation
        if (newStatusName === 'APPROVED' && currentStatusName !== 'PENDING') {
            throw new Error('Only PENDING transfers can be approved.');
        }
        if (newStatusName === 'COMPLETED' && currentStatusName !== 'APPROVED') {
            throw new Error('Only APPROVED transfers can be completed.');
        }
        // Add more checks for CANCELLED, REJECTED if needed

        // --- 3. RE-VALIDATE STOCK ON APPROVE ---
        if (newStatusName === 'APPROVED') {
            const { data: stockData, error: stockErr } = await stockService.listStockLevels({
                item_id: transfer.item_id,
                warehouse_id: transfer.source_warehouse_id
            });
            if (stockErr) throw stockErr;

            const currentStock = stockData.length > 0 ? stockData[0].quantity : 0;
            if (currentStock < transfer.quantity) {
                throw new Error(`Cannot approve. Insufficient stock. Available: ${currentStock}, Requested: ${transfer.quantity}`);
            }
        }
        // --- END RE-VALIDATION ---

        // 4. Get the target status ID
        const newStatusId = await transferService.getStatusIdByName(newStatusName);
        if (!newStatusId) throw new Error(`Status "${newStatusName}" not found.`);

        // 5. Update the transfer request status
        const updatePayload = { status_id: newStatusId };
        // approved_by removed
        const { data: updatedTransfer, error: updateErr } = await transferService.updateTransfer(id, updatePayload);
        if (updateErr) throw updateErr;

        // --- 6. UPDATE STOCK ON COMPLETE ---
        if (newStatusName === 'COMPLETED') {
            // Subtract from source
            const { error: outError } = await stockService.updateStockAndLogTransaction({
                item_id: transfer.item_id,
                warehouse_id: transfer.source_warehouse_id,
                type: 'OUT',
                quantity: transfer.quantity,
                notes: `Transfer OUT to Warehouse ID: ${transfer.dest_warehouse_id}`,
                transfer_request_id: id
                // initiated_by removed
            });
            // If OUT fails (e.g., stock changed *after* approval), the IN won't happen.
            if (outError) throw new Error(`Transfer marked COMPLETE, but source stock update failed: ${outError.message}`);

            // Add to destination
            const { error: inError } = await stockService.updateStockAndLogTransaction({
                item_id: transfer.item_id,
                warehouse_id: transfer.dest_warehouse_id,
                type: 'IN',
                quantity: transfer.quantity,
                notes: `Transfer IN from Warehouse ID: ${transfer.source_warehouse_id}`,
                transfer_request_id: id
                // initiated_by removed
            });
            // If IN fails, we have an inconsistency. Log critical error.
            if (inError) {
                 console.error(`CRITICAL INCONSISTENCY: Transfer ${id} COMPLETE, source stock updated, but destination stock update failed!`, inError);
                 // Return success but log the error server-side. Frontend shows complete.
                 // Manual correction might be needed.
            }
        }
        // --- END STOCK UPDATE ---

        return success(res, updatedTransfer, `Transfer status updated to ${newStatusName}`);

    } catch(err) {
        // Handle validation errors (400) or DB errors (500)
        const statusCode = (err.message.includes('Insufficient stock') || err.message.includes('Only') || err.message.includes('not found')) ? 400 : 500;
        return error(res, err.message || 'Failed to update transfer status.', statusCode);
    }
}

// Update transfer details (like reason) - separate from status updates
async function updateTransfer(req, res) {
  const { id } = req.params;
  const payload = req.body; // e.g., { reason: "New reason" }
   // Basic validation if needed
  if (!payload || Object.keys(payload).length === 0) {
      return error(res, 'No data provided for update.', 400);
  }
  // Remove fields that shouldn't be updated here
  delete payload.status_id;
  delete payload.quantity;
  // removed updated_by

  try {
      const { data, error: svcErr } = await transferService.updateTransfer(id, payload);
      if (svcErr) throw svcErr;
      if (!data) return error(res, 'Transfer request not found', 404);
      return success(res, data, 'Transfer request updated');
  } catch (err) {
       return error(res, err.message || 'Failed to update transfer request', 500);
  }
}


module.exports = {
  listTransfers,
  getTransfer,
  createTransfer,
  updateTransfer, // For updating details like 'reason'
  approveTransfer: updateTransferStatus('APPROVED'),
  rejectTransfer: updateTransferStatus('REJECTED'),
  completeTransfer: updateTransferStatus('COMPLETED'),
  cancelTransfer: updateTransferStatus('CANCELLED'),
};

