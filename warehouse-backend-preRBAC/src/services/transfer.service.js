// src/services/transfer.service.js
const supabase = require('../config/supabaseclient');
const TRANSFERS_TABLE = 'transfer_requests';
const STATUS_TABLE = 'transfer_statuses';

async function listTransfers(filters = {}) {
  try {
    // Joins with warehouses, items, and transfer_statuses to get complete data
    let query = supabase.from(TRANSFERS_TABLE).select(`
      transfer_id,
      item_id,
      source_warehouse_id,
      dest_warehouse_id,
      quantity,
      reason,
      requested_at,
      updated_at,
      requested_by,
      approved_by,
      item:items(name),
      source:warehouses_old!source_warehouse_id(warehouse_id, name),
      destination:warehouses_old!dest_warehouse_id(warehouse_id, name),
      status:transfer_statuses(status_id, status_name)
    `);
    
    if (filters.status_id) {
        query = query.eq('status_id', filters.status_id);
    }
    
    const { data, error } = await query.order('requested_at', { ascending: false });
    
    if (error) return { data: null, error };
    
    // Transform data for frontend
    const transformedData = data?.map(transfer => ({
      id: transfer.transfer_id,
      item: transfer.item?.name || 'Unknown Item',
      from: transfer.source?.name || 'Unknown Warehouse',
      to: transfer.destination?.name || 'Unknown Warehouse',
      quantity: transfer.quantity,
      status: transfer.status?.status_name || 'UNKNOWN',
      requestedAt: transfer.requested_at,
      reason: transfer.reason,
      // Include raw IDs for backend operations
      transfer_id: transfer.transfer_id,
      item_id: transfer.item_id,
      source_warehouse_id: transfer.source_warehouse_id,
      dest_warehouse_id: transfer.dest_warehouse_id,
      status_id: transfer.status?.status_id
    })) || [];
    
    return { data: transformedData, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function getTransfer(id) {
 
  return supabase.from(TRANSFERS_TABLE).select(`
    *,
    source:source_warehouse_id(*),
    destination:dest_warehouse_id(*),
    status:status_id(*)
  `).eq('transfer_id', id).single();
}

async function createTransfer(payload) {
  try {
    // Get the PENDING status ID
    const { data: pendingStatus } = await supabase
      .from(STATUS_TABLE)
      .select('status_id')
      .eq('status_name', 'PENDING')
      .single();
    
    if (!pendingStatus) {
      return { data: null, error: new Error('PENDING status not found') };
    }
    
    const transferData = {
      item_id: payload.item_id,
      source_warehouse_id: payload.source_warehouse_id,
      dest_warehouse_id: payload.dest_warehouse_id,
      quantity: payload.quantity,
      reason: payload.reason || null,
      status_id: pendingStatus.status_id
      // Skip requested_by for now to avoid foreign key issues
    };
    
    const { data, error } = await supabase
      .from(TRANSFERS_TABLE)
      .insert(transferData)
      .select(`
        transfer_id,
        quantity,
        reason,
        requested_at,
        item:items(name),
        source:warehouses_old!source_warehouse_id(name),
        destination:warehouses_old!dest_warehouse_id(name),
        status:transfer_statuses(status_name)
      `)
      .single();
    
    if (error) return { data: null, error };
    
    // Transform for frontend
    const transformedData = {
      id: data.transfer_id,
      item: data.item?.name || 'Unknown Item',
      from: data.source?.name || 'Unknown Warehouse',
      to: data.destination?.name || 'Unknown Warehouse',
      quantity: data.quantity,
      status: data.status?.status_name || 'PENDING',
      requestedAt: data.requested_at,
      reason: data.reason
    };
    
    return { data: transformedData, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function updateTransfer(id, payload) {
  
  return supabase.from(TRANSFERS_TABLE).update(payload).eq('transfer_id', id).select().single();
}


async function getStatusIdByName(statusName) {
    const { data, error } = await supabase
        .from(STATUS_TABLE)
        .select('status_id')
        .eq('status_name', statusName)
        .single();
    
    if (error) throw new Error(`Could not find status ID for "${statusName}"`);
    return data.status_id;
}

module.exports = {
  listTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
  getStatusIdByName,
};
