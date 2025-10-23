// src/controllers/reports.controller.js
const supabase = require('../config/supabaseclient');
const { success, error } = require('../utils/response');

// Dashboard statistics using correct RBAC tables
async function getDashboardStats(req, res) {
    try {
        // Get items count
        const { data: items, error: itemsError } = await supabase
            .from('items')
            .select('item_id')
            .eq('is_active', true);
        
        // Get warehouses count
        const { data: warehouses, error: warehousesError } = await supabase
            .from('warehouses_old')
            .select('warehouse_id')
            .eq('is_active', true);
        
        // Get total stock across all warehouses
        const { data: stockLevels, error: stockError } = await supabase
            .from('stock_levels')
            .select('quantity');
        
        // Calculate low stock items (items below reorder level)
        const { data: lowStockData, error: lowStockError } = await supabase
            .from('items')
            .select(`
                item_id,
                reorder_level,
                stock_levels(quantity)
            `)
            .eq('is_active', true);
        
        // Handle potential errors or null data gracefully
        const itemsCount = items ? items.length : 0;
        const warehousesCount = warehouses ? warehouses.length : 0;
        const totalStock = stockLevels ? stockLevels.reduce((sum, stock) => sum + (stock.quantity || 0), 0) : 0;
        
        // Calculate low stock items
        let lowStockCount = 0;
        if (lowStockData) {
            lowStockCount = lowStockData.filter(item => {
                const totalItemStock = item.stock_levels?.reduce((sum, stock) => sum + (stock.quantity || 0), 0) || 0;
                return totalItemStock <= item.reorder_level;
            }).length;
        }
        
        const dashboardData = {
            totalStockItems: totalStock,
            lowStockItems: lowStockCount,
            totalWarehouses: warehousesCount,
            monthlyRevenue: 50000 // dummy data - could be calculated from transactions
        };
        
        return success(res, dashboardData);
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return error(res, err.message, 500);
    }
}

async function getInventorySummary(req, res) {
    try {
        // Example RPC call to a Supabase function
        const { data, error: rpcError } = await supabase.rpc('get_inventory_summary');
        if (rpcError) throw rpcError;
        return success(res, data);
    } catch(err) {
        return error(res, err.message, 500);
    }
}


module.exports = { 
    getDashboardStats,
    getInventorySummary
    // Add other report functions here as they are built
};
