// src/services/warehouse.service.js
const supabase = require('../config/supabaseclient');
const WAREHOUSES_TABLE = 'warehouses';

async function listWarehouses() {
  return supabase.from(WAREHOUSES_TABLE).select('*');
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
  // In a real app, you'd check for dependencies (stock, users) before deleting
  return supabase.from(WAREHOUSES_TABLE).delete().eq('warehouse_id', id);
}

module.exports = {
  listWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
