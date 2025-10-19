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
  try {
    
    const pendingStatusId = await transferService.getStatusIdByName('PENDING');

    const payload = { 
        ...req.body, 
        requested_by: req.user?.id,
        status_id: pendingStatusId // Use the ID here
      };
    if (payload.source_warehouse_id === payload.dest_warehouse_id) {
        return error(res, 'Source and destination warehouses cannot be the same', 400);
    }
    const { data, error: svcErr } = await transferService.createTransfer(payload);
    if (svcErr) return error(res, svcErr.message, 500);
    return success(res, data, 'Transfer request created', 201);
  } catch(err) {
      return error(res, err.message, 500);
  }
}

async function updateTransfer(req, res) {
  const { id } = req.params;
  const payload = { ...req.body, updated_by: req.user?.id };
  const { data, error: svcErr } = await transferService.updateTransfer(id, payload);
  if (svcErr) return error(res, svcErr.message, 500);
  return success(res, data, 'Transfer request updated');
}


const updateTransferStatus = (newStatusName) => async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        
        const newStatusId = await transferService.getStatusIdByName(newStatusName);
        let payload = { status_id: newStatusId };

        if(newStatusName === 'APPROVED') payload.approved_by = userId;
        if(newStatusName === 'COMPLETED') payload.completed_by = userId; // You may need a completed_by column

        const { data: transfer, error: fetchErr } = await transferService.getTransfer(id);
        if(fetchErr || !transfer) return error(res, 'Transfer not found', 404);
        
    
        if(newStatusName === 'APPROVED' && transfer.status.status_name !== 'PENDING') return error(res, 'Only pending transfers can be approved', 400);
        if(newStatusName === 'COMPLETED' && transfer.status.status_name !== 'APPROVED') return error(res, 'Only approved transfers can be completed', 400);

        const { data, error: updateErr } = await transferService.updateTransfer(id, payload);
        if (updateErr) return error(res, updateErr.message, 500);

        if (newStatusName === 'COMPLETED') {
            await stockService.createTransaction({
                item_id: transfer.item_id,
                warehouse_id: transfer.source_warehouse_id,
                type: 'OUT',
                quantity: transfer.quantity,
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

        return success(res, data, `Transfer status updated to ${newStatusName}`);
    } catch(err) {
        return error(res, err.message, 500);
    }
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
