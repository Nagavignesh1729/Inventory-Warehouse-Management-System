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
        // Get stock summary
        const { data: stockLevels, error: stockError } = await supabase
            .from('stock_levels')
            .select(`
                quantity,
                item:items(reorder_level, name),
                warehouse:warehouses_old(name)
            `);

        if (stockError) throw stockError;

        // Calculate stock status
        let inStock = 0;
        let lowStock = 0;
        let outOfStock = 0;

        stockLevels?.forEach(stock => {
            const quantity = stock.quantity || 0;
            const reorderLevel = stock.item?.reorder_level || 0;
            
            if (quantity === 0) {
                outOfStock++;
            } else if (quantity <= reorderLevel) {
                lowStock++;
            } else {
                inStock++;
            }
        });

        // Get category breakdown
        const { data: categoryData, error: categoryError } = await supabase
            .from('items')
            .select(`
                category:categories(name),
                stock_levels(quantity)
            `)
            .eq('is_active', true);

        const categoryBreakdown = {};
        categoryData?.forEach(item => {
            const categoryName = item.category?.name || 'Uncategorized';
            const totalStock = item.stock_levels?.reduce((sum, stock) => sum + (stock.quantity || 0), 0) || 0;
            
            if (!categoryBreakdown[categoryName]) {
                categoryBreakdown[categoryName] = 0;
            }
            categoryBreakdown[categoryName] += totalStock;
        });

        // Get recent activity (last 10 transactions)
        const { data: recentTransactions, error: transactionError } = await supabase
            .from('transactions')
            .select(`
                type,
                quantity,
                transaction_date,
                item:items(name),
                warehouse:warehouses_old(name)
            `)
            .order('transaction_date', { ascending: false })
            .limit(10);

        const recentActivity = recentTransactions?.map((transaction, index) => ({
            id: index + 1,
            action: transaction.type === 'IN' ? 'Stock Added' : 
                   transaction.type === 'OUT' ? 'Stock Removed' : 'Stock Adjusted',
            item: transaction.item?.name || 'Unknown Item',
            warehouse: transaction.warehouse?.name || 'Unknown Warehouse',
            time: new Date(transaction.transaction_date).toLocaleDateString(),
            quantity: transaction.quantity
        })) || [];

        const summaryData = {
            stockSummary: {
                inStock,
                lowStock,
                outOfStock
            },
            categoryBreakdown: Object.entries(categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count })),
            recentActivity
        };

        return success(res, summaryData);
    } catch(err) {
        console.error('Inventory summary error:', err);
        return error(res, err.message, 500);
    }
}


module.exports = { 
    getDashboardStats,
    getInventorySummary
    // Add other report functions here as they are built
};
