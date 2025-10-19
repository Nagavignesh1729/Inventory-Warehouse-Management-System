const supabase = require('../config/supabaseclient');
const STOCK = 'stock_levels';
const TRANSACTIONS = 'transactions';

async function getStock(itemId, warehouseId) {
  return supabase.from(STOCK).select('*').eq('item_id', itemId).eq('warehouse_id', warehouseId).single();
}

async function setStock(itemId, warehouseId, quantity, updated_by) {
  // upsert style: if exists update, else insert
  const payload = {
    item_id: itemId,
    warehouse_id: warehouseId,
    quantity,
    last_updated: new Date().toISOString(),
    updated_by
  };

  // try update
  const { data: existing } = await supabase.from(STOCK).select('*').eq('item_id', itemId).eq('warehouse_id', warehouseId).single();
  if (existing) {
    return supabase.from(STOCK).update(payload).eq('stock_id', existing.stock_id).select().single();
  }
  return supabase.from(STOCK).insert(payload).select().single();
}

async function createTransaction({ item_id, warehouse_id, type, quantity, notes = null, initiated_by = null, transfer_request_id = null }) {
  const payload = {
    item_id,
    warehouse_id,
    type,
    quantity,
    notes,
    transaction_date: new Date().toISOString(),
    initiated_by,
    transfer_request_id,
    updated_by: initiated_by
  };
  return supabase.from(TRANSACTIONS).insert(payload).select().single();
}

module.exports = {
  getStock,
  setStock,
  createTransaction
};
