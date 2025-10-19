// src/controllers/transfer.controller.js
const transferService = require('../services/transfer.service');
const stockService = require('../services/stock.service');
const { success, error } = require('../utils/response');

async function listTransfers(req, res) {
  const { status } = req.query;
  const { data, error: svcErr } = await transferService.listTransfers({ status });
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data);
}

async function getTransfer(req, res) {
  const { id } = req.params;
  const { data, error: svcErr } = await transferService.getTransfer(id);
  if (svcErr) return error(res, svcErr.message, 500);
  if (!data) return error(res, 'Transfer not found', 404);
  return success(res, data);
}

async function createTransfer(req, res) {
  const payload = { 
      ...req.body, 
      requested_by: req.user?.id,
      status: 'PENDING'
    };
  if (payload.source_warehouse_id === payload.dest_warehouse_id) {
      return error(res, 'Source and destination warehouses cannot be the same', 400);
  }
  const { data, error: svcErr } = await transferService.createTransfer(payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Transfer request created', 201);
}

async function updateTransfer(req, res) {
  const { id } = req.params;
  const payload = { ...req.body, updated_by: req.user?.id };
  const { data, error: svcErr } = await transferService.updateTransfer(id, payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Transfer request updated');
}

// Approve, Reject, Complete, Cancel...
const updateTransferStatus = (newStatus) => async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    let payload = { status: newStatus };

    if(newStatus === 'APPROVED') payload.approved_by = userId;
    if(newStatus === 'COMPLETED') payload.completed_by = userId;

    const { data: transfer, error: fetchErr } = await transferService.getTransfer(id);
    if(fetchErr || !transfer) return error(res, 'Transfer not found', 404);
    
    // Simple state machine validation
    if(newStatus === 'APPROVED' && transfer.status !== 'PENDING') return error(res, 'Only pending transfers can be approved', 400);
    if(newStatus === 'COMPLETED' && transfer.status !== 'APPROVED') return error(res, 'Only approved transfers can be completed', 400);

    const { data, error: updateErr } = await transferService.updateTransfer(id, payload);
    if (updateErr) return error(res, updateErr.message, 500);

    // If completed, create transactions
    if (newStatus === 'COMPLETED') {
        await stockService.createTransaction({
            item_id: transfer.item_id,
            warehouse_id: transfer.source_warehouse_id,
            type: 'OUT',
            quantity: -transfer.quantity,
            notes: `Transfer to ${transfer.destination.name}`,
            initiated_by: userId,
            transfer_request_id: id,
        });
        await stockService.createTransaction({
            item_id: transfer.item_id,
            warehouse_id: transfer.dest_warehouse_id,
            type: 'IN',
            quantity: transfer.quantity,
            notes: `Transfer from ${transfer.source.name}`,
            initiated_by: userId,
            transfer_request_id: id,
        });
    }

    return success(res, data, `Transfer status updated to ${newStatus}`);
}


module.exports = {
  listTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  approveTransfer: updateTransferStatus('APPROVED'),
  rejectTransfer: updateTransferStatus('REJECTED'),
  completeTransfer: updateTransferStatus('COMPLETED'),
  cancelTransfer: updateTransferStatus('CANCELLED'),
};
