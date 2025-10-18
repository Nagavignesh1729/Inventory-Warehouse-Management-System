// src/services/item.service.js
const supabase = require('../config/supabaseclient');
const ITEMS_TABLE = 'items';

async function listItems() {
  return supabase.from(ITEMS_TABLE).select('*');
}

async function getItem(id) {
  return supabase.from(ITEMS_TABLE).select('*, category:categories(*), supplier:suppliers(*)').eq('item_id', id).single();
}

async function createItem(payload) {
  return supabase.from(ITEMS_TABLE).insert(payload).select().single();
}

async function updateItem(id, payload) {
  return supabase.from(ITEMS_TABLE).update(payload).eq('item_id', id).select().single();
}

async function deleteItem(id) {
  return supabase.from(ITEMS_TABLE).delete().eq('item_id', id);
}

async function getLowStockItems() {
    // This is a simplified version. A real implementation might require a join
    // with a stock_levels table and compare quantity with reorder_level.
    // We can use a view or RPC in Supabase for this. For now, let's assume a simple query.
    return supabase.from(ITEMS_TABLE).select('*').lt('stockLevel', 20); // Example threshold
}


module.exports = {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
};
