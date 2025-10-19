// src/services/warehouse.service.js
const supabase = require('../config/supabaseclient');
const WAREHOUSES_TABLE = 'warehouses';

/**
 * Fetches a list of warehouses, including calculated fields like
 * total stock and utilization, which the frontend expects.
 * done with a Supabase RPC function for efficiency.
 */
async function listWarehouses() {
  
  const { data, error } = await supabase.rpc('get_warehouse_details');
  
  if (error) {
    console.error("RPC Error: 'get_warehouse_details' function might be missing in Supabase. Falling back to a basic query.", error);
    // Fallback to a simple query if the RPC function doesn't exist
    return supabase.from(WAREHOUSES_TABLE).select('*');
  }
  
  return { data, error };
}

async function getWarehouse(id) {
  return supabase.from(WAREHOUSES_TABLE).select('*').eq('warehouse_id', id).single();
}

async function createWarehouse(payload) {
  return supabase.from(WAREHOUSES_TABLE).insert(payload).select().single();
}

async function updateWarehouse(id, payload) {
  return supabase.from(WAREHOUSES_TABLE).update(payload).eq('warehouse_id', id).select().single();
}

async function deleteWarehouse(id) {
  return supabase.from(WAREHOUSES_TABLE).delete().eq('warehouse_id', id);
}

module.exports = {
  listWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
