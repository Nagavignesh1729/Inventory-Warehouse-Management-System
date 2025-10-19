// src/services/transfer.service.js
const supabase = require('../config/supabaseclient');
const TRANSFERS_TABLE = 'transfer_requests';

async function listTransfers(filters = {}) {
  let query = supabase.from(TRANSFERS_TABLE).select('*, source:warehouses!source_warehouse_id(*), destination:warehouses!dest_warehouse_id(*)');
  if(filters.status) {
      query = query.eq('status', filters.status);
  }
  return query.order('created_at', { ascending: false });
}

async function getTransfer(id) {
  return supabase.from(TRANSFERS_TABLE).select('*, source:warehouses!source_warehouse_id(*), destination:warehouses!dest_warehouse_id(*)').eq('request_id', id).single();
}

async function createTransfer(payload) {
  return supabase.from(TRANSFERS_TABLE).insert(payload).select().single();
}

async function updateTransfer(id, payload) {
  return supabase.from(TRANSFERS_TABLE).update(payload).eq('request_id', id).select().single();
}

module.exports = {
  listTransfers,
  getTransfer,
  createTransfer,
  updateTransfer,
};
