// src/services/item.service.js
const supabase = require('../config/supabaseclient');
const ITEMS_TABLE = 'items';

/**
 * Fetches items. Now supports filtering by warehouse_id.
 * It also calculates the 'status' field on the backend to ensure
 * consistent business logic.
 */
async function listItems(filters = {}) {
  // This query is designed to call a Supabase RPC function `get_item_details`
  // which would handle joins and status calculation.
  const { data, error } = await supabase.rpc('get_item_details', {
    w_id: filters.warehouse_id || null // Pass warehouse_id filter to the function
  });
  
  if (error) {
    console.error("RPC Error: 'get_item_details' function might be missing. Falling back to a basic query.", error);
    // Fallback if RPC doesn't exist
    let query = supabase.from(ITEMS_TABLE).select('*, warehouse:warehouses(name)');
    if (filters.warehouse_id) {
      query = query.eq('warehouse_id', filters.warehouse_id);
    }
    return query;
  }
  
  return { data, error };
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

// This function is now part of the main `listItems` RPC logic
// but can be kept for a separate endpoint if needed.
async function getLowStockItems() {
    const { data, error } = await supabase.rpc('get_low_stock_items');
    return { data, error };
}


module.exports = {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getLowStockItems,
};
