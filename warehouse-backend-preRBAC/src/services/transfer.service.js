// src/services/transfer.service.js
const supabase = require('../config/supabaseclient');
const TRANSFERS_TABLE = 'transfer_requests';
const STATUS_TABLE = 'transfer_statuses';

async function listTransfers(filters = {}) {
  // Joins with warehouses and transfer_statuses to get names
  let query = supabase.from(TRANSFERS_TABLE).select(`
    *,
    source:source_warehouse_id(*),
    destination:dest_warehouse_id(*),
    status:status_id(*)
  `);
  
  if (filters.status_id) {
      query = query.eq('status_id', filters.status_id);
  }
  return query.order('requested_at', { ascending: false });
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
  return supabase.from(TRANSFERS_TABLE).insert(payload).select().single();
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
