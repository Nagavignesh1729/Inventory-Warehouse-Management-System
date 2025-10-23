// src/services/warehouse.service.js
const supabase = require('../config/supabaseclient');
const WAREHOUSES_TABLE = 'warehouses_old';

/**
 * Fetches a list of warehouses with calculated fields
 */
async function listWarehouses() {
  try {
    // Try RPC function first
    const { data, error } = await supabase.rpc('get_warehouse_details');
    
    if (error) {
      console.error("RPC Error: 'get_warehouse_details' function might be missing in Supabase. Falling back to a basic query.", error);
      
      // Fallback to basic query with stock calculation
      const { data: warehouses, error: warehouseError } = await supabase
        .from(WAREHOUSES_TABLE)
        .select(`
          warehouse_id,
          name,
          location,
          address,
          capacity,
          manager,
          phone,
          email,
          status,
          is_active,
          created_at,
          updated_at
        `);
      
      if (warehouseError) return { data: null, error: warehouseError };
      
      // Calculate stock levels for each warehouse
      const warehousesWithStock = await Promise.all(
        warehouses.map(async (warehouse) => {
          const { data: stockData } = await supabase
            .from('stock_levels')
            .select('quantity')
            .eq('warehouse_id', warehouse.warehouse_id);
          
          const totalStock = stockData?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
          const utilization = warehouse.capacity > 0 ? Math.round((totalStock / warehouse.capacity) * 100) : 0;
          
          return {
            ...warehouse,
            current_stock: totalStock,
            total_stock: totalStock,
            utilization: utilization
          };
        })
      );
      
      return { data: warehousesWithStock, error: null };
    }
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
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
